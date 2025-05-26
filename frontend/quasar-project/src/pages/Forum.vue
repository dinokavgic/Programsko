<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="q-gutter-md">
      <div class="row q-col-gutter-lg">
        <!-- Sidebar -->
        <div class="col-3">
          <q-card class="q-mb-md">
            <q-card-section class="text-subtitle2">Kategorije</q-card-section>
            <q-list bordered>
              <q-item clickable v-ripple @click="selectedCategory = ''; page = 1">
                <q-item-section>Prikaži sve</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="selectedCategory = 'Općenito'; page = 1">
                <q-item-section>Općenito</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="selectedCategory = 'Iskustva'; page = 1">
                <q-item-section>Iskustva</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="selectedCategory = 'Moji članci'; page = 1">
                <q-item-section>Moji članci</q-item-section>
              </q-item>
            </q-list>
          </q-card>

          <q-card>
            <q-card-section class="text-subtitle2">Sortiraj</q-card-section>
            <q-list bordered>
              <q-item clickable v-ripple @click="handleSort('date_desc')">
                <q-item-section>Datum ↓</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="handleSort('date_asc')">
                <q-item-section>Datum ↑</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <!-- Glavni sadržaj -->
        <div class="col-6">
          <q-btn label="Novi članak" color="primary" class="q-mb-md" @click="showNewArticle = true" />

          <q-card v-for="art in currentArticles" :key="art.id" class="q-mb-md">
            <q-card-section>
              <div class="text-h6">{{ art.title }}</div>
              <div class="text-caption text-grey">
                {{ art.author }} · {{ art.category }} · {{ art.time }} · {{ art.date }}
              </div>
              <div class="q-mt-sm">{{ art.text }}</div>
              <div v-if="art.images && art.images.length" class="q-mt-md">
  <q-img
    v-for="(img, i) in art.images"
    :key="i"
    :src="img"
    style="max-width: 100%; max-height: 300px"
    class="q-mb-sm"
  />
</div>       

<q-btn
  v-if="user && (art.author === user.uid || user.adminStatus)"
  dense
  flat
  size="sm"
  color="negative"
  label="Obriši članak"
  @click="deleteArticle(art.id)"
  class="q-mt-sm"
/>
            </q-card-section>

    <!-- Like gumb -->
    <div class="row items-center q-mb-sm">
      <q-btn
        flat
        round
        dense
        icon="favorite"
        :color="art.likes?.includes(user?.uid) ? 'red' : 'grey'"
        @click="toggleLike(art)"
        :disable="!user"
      />
      <span class="q-ml-sm text-caption">{{ art.likes?.length || 0 }} sviđanja</span>
    </div>
            <q-separator />

            <q-card-section>
              <div class="text-caption">{{ art.comments.length }} komentara</div>

              <div v-for="(comment, index) in art.comments" :key="index" class="q-mt-xs">
                <div class="text-caption">{{ comment.author }} · {{ comment.time }} · {{ comment.date }}</div>

                <div v-if="editingComment.articleId === art.id && editingComment.index === index">
                  <q-input v-model="editingComment.text" dense filled autofocus />
                  <div class="q-mt-sm">
                    <q-btn label="Spremi" color="positive" dense @click="saveComment(art.id, index)" />
                    <q-btn label="Odustani" dense flat @click="cancelEdit" />
                  </div>
                </div>
                <div v-else>
                  <div>{{ comment.text }}</div>
                  <q-btn dense flat size="sm" label="Uredi" @click="editComment(art.id, index, comment.text)" />
                  <q-btn dense flat size="sm" color="negative" label="Obriši" @click="deleteComment(art.id, index)" />
                </div>
              </div>

              <q-input v-model="newComments[art.id]" label="Tvoj komentar..." dense filled class="q-mt-md" />
              <q-btn label="Pošalji komentar" color="primary" dense class="q-mt-sm" @click="submitComment(art.id)" />
            </q-card-section>

          </q-card>

          <q-pagination
            v-model="page"
            :max="maxPages"
            max-pages="5"
            boundary-numbers
            direction-links
            class="justify-center"
          />
        </div>

        <!-- Desna kolona - bodovi -->
        <div class="col-3">
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle2">Moji bodovi</div>
              <div class="text-h5">{{ bodovi }} ☕</div>
              <div class="text-caption">Sakupljaj bodove i ostvari pogodnosti na iduću kupnju.</div>
              <q-btn label="Saznaj kako ih zaraditi" flat class="q-mt-sm" @click="showHowToEarn = !showHowToEarn" />
              <div v-if="showHowToEarn" class="q-mt-sm text-body2">
                Ostavi komentare, lajkaj objave i sudjeluj u raspravama. Više aktivnosti = više bodova!
              </div>
            </q-card-section>
          </q-card>

          <q-card v-if="showInfoCard">
            <q-card-section>
              <div class="text-subtitle2">Bodovi</div>
              <div class="text-caption">
                Ovaj ogledni tekst opisuje kako se bodovi zarađuju na forumu. Objavom ili lajkom možeš ih skupiti.
              </div>
              <q-btn label="Shvaćam" color="primary" flat class="q-mt-sm" @click="showInfoCard = false" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Dialog za novi članak -->
    <q-dialog v-model="showNewArticle">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Novi članak</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newArticle.title" label="Naslov" filled class="q-mb-sm" />
          <q-input v-model="newArticle.text" label="Tekst" type="textarea" filled class="q-mb-sm" />
          <q-select
            v-model="newArticle.category"
            :options="['Općenito', 'Iskustva', 'Moji članci']"
            label="Kategorija"
            filled
            class="q-mb-sm"
          />
           <q-uploader
              ref="uploaderRef"
              v-model="slike"
              label="Fotografije"
              multiple
              accept="image/*"
              :filter="filterSlike"
              auto-upload="false"
              style="max-width: 300px"
              @added="dodajSlike"
            />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" color="negative" v-close-popup @click="cancelNewArticle" />
          <q-btn flat label="Objavi" color="primary" @click="addArticle" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { db} from 'src/firebase'
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from 'stores/auth'
import { dodajBodKorisniku, oduzmiBodKorisniku } from 'src/bodovi'
import { deleteDoc } from 'firebase/firestore'


function navigateToLogin() {
  window.location.href = '/LogIn';
}

const page = ref(1)
const bodovi = ref(0)
const showNewArticle = ref(false)
const showHowToEarn = ref(false)
const showInfoCard = ref(true)
const selectedCategory = ref('')
const activeSort = ref('date_desc')
const articles = ref([])
const newComments = reactive({})
const editingComment = reactive({ articleId: null, index: null, text: '' })
const authStore = useAuthStore()
const user = authStore.user
const slikeFiles = ref([])


const newArticle = reactive({
  title: '',
  text: '',
  category: '',
  image: []
})

const filteredArticles = computed(() => {
  if (!selectedCategory.value) return articles.value
  
  return articles.value.filter((a) => a.category === selectedCategory.value)
})

const currentArticles = computed(() => {
  const start = (page.value - 1) * 3

  return filteredArticles.value.slice(start, start + 3)
})

const maxPages = computed(() => Math.ceil(filteredArticles.value.length / 3))

function cancelEdit() {
  editingComment.articleId = null
  editingComment.index = null
  editingComment.text = ''
}

function editComment(articleId, index, text) {
  editingComment.articleId = articleId
  editingComment.index = index
  editingComment.text = text
}

function saveComment(articleId, index) {
  const article = articles.value.find((a) => a.id === articleId)
  if (!article || index < 0 || index >= article.comments.length) return
  article.comments[index].text = editingComment.text
  cancelEdit()
}

function deleteComment(articleId, index) {
  const article = articles.value.find((a) => a.id === articleId)
  if (!article || index < 0 || index >= article.comments.length) return
  article.comments.splice(index, 1)
  bodovi.value--
}

async function toggleLike(article) {
  if (!user?.uid) {
    navigateToLogin()

    return
  }

  const articleRef = doc(db, 'articles', article.id)
  const alreadyLiked = article.likes?.includes(user.uid)

  if (alreadyLiked) {
    // Makni lajk lokalno
    article.likes = article.likes.filter(uid => uid !== user.uid)

    // Makni lajk u bazi
    await updateDoc(articleRef, {
      likes: arrayRemove(user.uid)
    })

    // Oduzmi bod autoru
    await oduzmiBodKorisniku(article.author)
  } else {
    // Dodaj lajk lokalno
    if (!article.likes) article.likes = []
    article.likes.push(user.uid)

    // Dodaj lajk u bazi
    await updateDoc(articleRef, {
      likes: arrayUnion(user.uid)
    })

    // Dodaj bod autoru
    await dodajBodKorisniku(article.author)
  }
}

async function submitComment(articleId) {
  if (!user?.uid) return navigateToLogin()

  const text = newComments[articleId]?.trim()
  if (!text) return

  const comment = {
    author: user.displayName || user.email || 'Korisnik',
    uid: user.uid,
    text,
    likes: 0,
    time: new Date().toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString('hr-HR')
  }

  const article = articles.value.find(a => a.id === articleId)
  if (article) {
    article.comments.push(comment)
  }

  const articleRef = doc(db, 'articles', articleId)
  await updateDoc(articleRef, {
    comments: arrayUnion(comment)
  })

  await dodajBodKorisniku(user.uid)
  newComments[articleId] = ''
  bodovi.value++
}

async function addArticle() {
  

const imageBase64List = await Promise.all(slikeFiles.value.map((file) => toBase64(file)))
  const newDoc = {
    title: newArticle.title,
    text: newArticle.text,
    category: newArticle.category,
      author: user.uid,
    time: new Date().toLocaleTimeString('hr-HR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    date: new Date().toLocaleDateString('hr-HR'),
    images: imageBase64List,
    comments: [],
    likes: [],
    createdAt: serverTimestamp()
  }

  const docRef = await addDoc(collection(db, 'articles'), newDoc)
  articles.value.unshift({ id: docRef.id, ...newDoc })
  resetNewArticle()
}

function resetNewArticle() {
  newArticle.title = ''
  newArticle.text = ''
  newArticle.category = ''
  slikeFiles.value = []
  showNewArticle.value = false
}

function cancelNewArticle() {
  resetNewArticle()
}

function handleSort(option) {
  activeSort.value = option
  if (option === 'date_desc') {
    articles.value.sort((a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-')))
  } else {
    articles.value.sort((a, b) => new Date(a.date.split('.').reverse().join('-')) - new Date(b.date.split('.').reverse().join('-')))
  }
}

const dodajSlike = (files) => {
  slikeFiles.value.push(...files)
}
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

onMounted(async () => {
  if (user?.uid) {
    const userDocRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userDocRef)
    if (userSnap.exists()) {
      const data = userSnap.data()
      bodovi.value = data.bodovi || 0
    }
  }

  const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  articles.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
})
async function deleteArticle(articleId) {
  const article = articles.value.find((a) => a.id === articleId)
  if (!article) return

  const isAuthor = article.author === user?.uid
  const isAdmin = authStore.user?.adminStatus === true

  if (!isAuthor && !isAdmin) {
    alert('Samo autor članka ili administrator može obrisati članak.')

    return
  }

  try {
    // ukloni iz baze
    const articleRef = doc(db, 'articles', articleId)
   await deleteDoc(articleRef)

    // ukloni iz lokalnog prikaza
    articles.value = articles.value.filter(a => a.id !== articleId)

    alert('Članak je uspješno obrisan.')
  } catch (error) {
    console.error('Greška pri brisanju članka:', error)
    alert('Došlo je do pogreške.')
  }
}
</script>
