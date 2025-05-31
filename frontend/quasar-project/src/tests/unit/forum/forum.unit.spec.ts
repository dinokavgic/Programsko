import { describe, it, expect } from 'vitest'
import { ref } from 'vue'

describe('Forum.vue – logika sortiranja članaka', () => {
    const articles = ref([
        { id: 1, title: 'Stari članak', date: '01.01.2023' },
        { id: 2, title: 'Novi članak', date: '01.01.2024' }
    ])

    function handleSort(option: 'date_asc' | 'date_desc') {
        if (option === 'date_desc') {
            articles.value.sort((a, b) =>
                new Date(b.date.split('.').reverse().join('-')).getTime() -
                new Date(a.date.split('.').reverse().join('-')).getTime()
            )
        } else {
            articles.value.sort((a, b) =>
                new Date(a.date.split('.').reverse().join('-')).getTime() -
                new Date(b.date.split('.').reverse().join('-')).getTime()
            )
        }
    }

    it('sortira članke po datumu silazno (noviji prvi)', () => {
        handleSort('date_desc')
        expect(articles.value[0].title).toBe('Novi članak')
    })

    it('sortira članke po datumu uzlazno (stariji prvi)', () => {
        handleSort('date_asc')
        expect(articles.value[0].title).toBe('Stari članak')
    })
})