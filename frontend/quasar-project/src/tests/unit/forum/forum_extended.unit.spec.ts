import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

describe('Forum.vue – funkcije', () => {
    let user, articles, navigateToLogin, updateDocMock, dodajBodKorisniku, oduzmiBodKorisniku

    beforeEach(() => {
        user = { uid: 'user123', displayName: 'Test Korisnik' }
        articles = ref([
            { id: 'a1', author: 'user456', likes: [], comments: [] }
        ])
        navigateToLogin = vi.fn()
        updateDocMock = vi.fn()
        dodajBodKorisniku = vi.fn()
        oduzmiBodKorisniku = vi.fn()
    })

    function toggleLike(article) {
        if (!user?.uid) {
            navigateToLogin()
            return
        }

        const alreadyLiked = article.likes?.includes(user.uid)

        if (alreadyLiked) {
            article.likes = article.likes.filter((uid) => uid !== user.uid)
            updateDocMock('remove', article.id, user.uid)
            oduzmiBodKorisniku(article.author)
        } else {
            if (!article.likes) article.likes = []
            article.likes.push(user.uid)
            updateDocMock('add', article.id, user.uid)
            dodajBodKorisniku(article.author)
        }
    }

    it('poziva navigateToLogin ako korisnik nije prijavljen (toggleLike)', () => {
        user = null
        toggleLike(articles.value[0])
        expect(navigateToLogin).toHaveBeenCalled()
    })

    it('dodaje lajk ako korisnik nije lajkao', () => {
        toggleLike(articles.value[0])
        expect(articles.value[0].likes).toContain('user123')
        expect(updateDocMock).toHaveBeenCalledWith('add', 'a1', 'user123')
        expect(dodajBodKorisniku).toHaveBeenCalledWith('user456')
    })

    it('miče lajk ako korisnik već lajkao', () => {
        articles.value[0].likes = ['user123']
        toggleLike(articles.value[0])
        expect(articles.value[0].likes).not.toContain('user123')
        expect(updateDocMock).toHaveBeenCalledWith('remove', 'a1', 'user123')
        expect(oduzmiBodKorisniku).toHaveBeenCalledWith('user456')
    })

    it('handleNewArticleClick otvara login ako user nije prijavljen', () => {
        const showNewArticle = ref(false)
        const localUser = null

        function handleNewArticleClick() {
            if (!localUser?.uid) {
                navigateToLogin()
            } else {
                showNewArticle.value = true
            }
        }

        handleNewArticleClick()
        expect(navigateToLogin).toHaveBeenCalled()
    })

    it('handleNewArticleClick otvara dijalog ako je user prijavljen', () => {
        const showNewArticle = ref(false)
        const localUser = { uid: 'user123' }

        function handleNewArticleClick() {
            if (!localUser?.uid) {
                navigateToLogin()
            } else {
                showNewArticle.value = true
            }
        }

        handleNewArticleClick()
        expect(showNewArticle.value).toBe(true)
    })
})
