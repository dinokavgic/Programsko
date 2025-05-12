<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="q-gutter-md">
      <div class="row q-col-gutter-lg">
        <!-- Sidebar -->
        <div class="col-3">
          <q-card class="q-mb-md">
            <q-card-section class="text-subtitle2">Kategorije
          </q-card-section>
            <q-list bordered>
              <q-item clickable v-ripple :active="selectedCategory === 'Moje objave'" :class="{ 'bg-primary text-white': selectedCategory === 'Moje objave' }">
  <q-item-section @click="selectedCategory = 'Moje objave'; page = 1">Moje objave</q-item-section>
</q-item>
              <q-item clickable v-ripple :active="selectedCategory === 'Sve'" :class="{ 'bg-primary text-white': selectedCategory === 'Sve' }">
  <q-item-section @click="selectedCategory = 'Sve'; page = 1">Sve</q-item-section>
</q-item>
              <q-item clickable v-ripple :active="selectedCategory === 'Općenito'" :class="{ 'bg-primary text-white': selectedCategory === 'Općenito' }">
  <q-item-section @click="selectedCategory = 'Općenito'; page = 1">Općenito</q-item-section>
</q-item>
              <q-item clickable v-ripple :active="selectedCategory === 'Iskustva'" :class="{ 'bg-primary text-white': selectedCategory === 'Iskustva' }">
  <q-item-section @click="selectedCategory = 'Iskustva'; page = 1">Iskustva</q-item-section>
</q-item>
              <q-item clickable v-ripple :active="selectedCategory === 'Moji članci'" :class="{ 'bg-primary text-white': selectedCategory === 'Moji članci' }">
  <q-item-section @click="selectedCategory = 'Moji članci'; page = 1">Moji članci</q-item-section>
</q-item>
            </q-list>
          </q-card>

          <q-card>
            <q-card-section class="text-subtitle2">Sortiraj</q-card-section>
            <q-list bordered>
              <q-item clickable v-ripple @click="activeSort = 'date_desc'; sortBy('date_desc')" :class="{ 'bg-primary text-white': activeSort === 'date_desc' }">
  <q-item-section>Datum dolje</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="activeSort = 'date_asc'; sortBy('date_asc')" :class="{ 'bg-primary text-white': activeSort === 'date_asc' }">
  <q-item-section>Datum gore</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <!-- Glavni sadržaj -->
        <div class="col-6">
          <q-btn label="Novi članak" color="primary" class="q-mb-md" @click="showNewArticle = true" />

          <!-- Lista članaka -->
          <q-card v-for="art in currentArticles" :key="art.id" class="q-mb-md">
            <q-card-section>
              <div class="text-h6">{{ art.title }}</div>
              <div class="text-caption text-grey">
                {{ art.author }} · {{ art.category }} · {{ art.time }} · {{ art.date }}
              </div>
              <div class="q-mt-sm">{{ art.text }}</div>
              <div v-if="art.image" class="q-mt-md">
                <q-img :src="art.image[0]?.__img?.src || art.image[0]?.__img" style="max-width: 100%; max-height: 300px" />
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="text-caption">{{ art.comments.length }} komentara</div>

              <div v-for="(comment, index) in art.comments" :key="index" class="q-mt-xs">
                <div class="text-caption">
                  {{ comment.author }} · {{ comment.time }} · {{ comment.date }}
                </div>

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

              <q-input
                v-model="newComments[art.id]"
                label="Tvoj komentar..."
                dense
                filled
                class="q-mt-md"
              />
              <q-btn
                label="Pošalji komentar"
                color="primary"
                dense
                class="q-mt-sm"
                @click="submitComment(art.id)"
              />
            </q-card-section>
          </q-card>

          <!-- Paginacija -->
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
              <div class="text-h5">{{ points }} ☕</div>
              <div class="text-caption">Sakupljaj bodove i ostvari pogodnosti na iduću kupnju.</div>
              <q-btn label="Saznaj kako ih zaraditi" flat class="q-mt-sm" @click="showTips = !showTips" />
              <div v-if="showTips" class="q-mt-sm text-body2">
                Ostavljaj komentare, lajkaj objave i piši članke da zaradiš više bodova.
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

    <q-dialog v-model="showNewArticle">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Novi članak</div>
          <q-uploader
            v-model="newArticle.image"
            label="Dodaj sliku"
            accept="image/*"
            auto-expand
            hide-upload-btn
            style="max-width: 100%"
          />
          <q-input v-model="newArticle.title" label="Naslov" filled class="q-mb-sm" />
          <q-input v-model="newArticle.text" label="Tekst" filled type="textarea" class="q-mb-sm" />
          <q-select
            v-model="newArticle.category"
            :options="['Općenito', 'Iskustva', 'Moji članci']"
            label="Kategorija"
            filled
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" color="primary" v-close-popup @click="cancelNewArticle" />
          <q-btn flat label="Objavi" color="primary" @click="addArticle" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const showNewArticle = ref(false)
const points = ref(245)
const newComments = reactive({})
const editingComment = reactive({
  articleId: null,
  index: null,
  text: ''
})

const showTips = ref(false)
const showInfoCard = ref(true)
const selectedCategory = ref('Sve')
const activeSort = ref('')

const newArticle = reactive({
  title: '',
  text: '',
  image: null,
  category: 'Općenito'
})

const page = ref(1)
const articlesPerPage = 2

const articles = ref([
  {
    id: 1,
    title: 'Naslov članka',
    author: 'Ime Prezime',
    category: 'Općenito',
    time: '12:30',
    date: '23.3.2025.',
    text: 'Ovo je primjer teksta objave na forumu.',
    comments: [
      {
        author: 'Komentator',
        text: 'Ovo je komentar na članak.',
        time: '16:30',
        date: '23.3.2025.'
      }
    ]
  },
  {
    id: 2,
    title: 'Drugi naslov članka',
    author: 'Ime Prezime',
    category: 'Iskustva',
    time: '14:30',
    date: '24.3.2025.',
    text: 'Još jedan primjer teksta objave na forumu.',
    comments: []
  },
  {
    id: 3,
    title: 'Moj članak',
    author: 'Trenutni Korisnik',
    category: 'Moji članci',
    time: '10:15',
    date: '25.3.2025.',
    text: 'Ovo je moj vlastiti članak.',
    comments: []
  }
])

const currentArticles = computed(() => {
  let filtered = articles.value

  if (selectedCategory.value === 'Moje objave') {
    filtered = filtered.filter(a => a.author === 'Trenutni Korisnik')
  } else if (selectedCategory.value !== 'Sve') {
    filtered = filtered.filter(a => a.category === selectedCategory.value)
  }

  const start = (page.value - 1) * articlesPerPage

  return filtered.slice(start, start + articlesPerPage)
})

const maxPages = computed(() => {
  let filteredLength = articles.value.length

  if (selectedCategory.value === 'Moje objave') {
    filteredLength = articles.value.filter(a => a.author === 'Trenutni Korisnik').length
  } else if (selectedCategory.value !== 'Sve') {
    filteredLength = articles.value.filter(a => a.category === selectedCategory.value).length
  }

  return Math.ceil(filteredLength / articlesPerPage)
})

function submitComment(articleId) {
  const text = newComments[articleId]?.trim()
  if (!text) return

  const article = articles.value.find(a => a.id === articleId)
  if (!article) return

  article.comments.push({
    author: 'Trenutni Korisnik',
    text,
    time: new Date().toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString('hr-HR')
  })

  newComments[articleId] = ''
  points.value += 1
}

function deleteComment(articleId, index) {
  const article = articles.value.find(a => a.id === articleId)
  if (!article || index < 0 || index >= article.comments.length) return

  article.comments.splice(index, 1)
  points.value -= 1
}

function editComment(articleId, index, text) {
  editingComment.articleId = articleId
  editingComment.index = index
  editingComment.text = text
}

function cancelEdit() {
  editingComment.articleId = null
  editingComment.index = null
  editingComment.text = ''
}

function saveComment(articleId, index) {
  const article = articles.value.find(a => a.id === articleId)
  if (!article || index < 0 || index >= article.comments.length) return

  article.comments[index].text = editingComment.text
  cancelEdit()
}

function sortBy(option) {
  if (option === 'date_desc') {
    articles.value.sort((a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-')))
  } else if (option === 'date_asc') {
    articles.value.sort((a, b) => new Date(a.date.split('.').reverse().join('-')) - new Date(b.date.split('.').reverse().join('-')))
  }
}

function addArticle() {
  if (!newArticle.title.trim() || !newArticle.text.trim()) return

  const now = new Date()
  articles.value.unshift({
    id: Date.now(),
    image: newArticle.image,
    title: newArticle.title,
    text: newArticle.text,
    author: 'Trenutni Korisnik',
    category: newArticle.category,
    time: now.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' }),
    date: now.toLocaleDateString('hr-HR'),
    comments: []
  })

  newArticle.title = ''
  newArticle.text = ''
  newArticle.image = null
  showNewArticle.value = false
}

function cancelNewArticle() {
  newArticle.title = ''
  newArticle.text = ''
  showNewArticle.value = false
}
</script>
