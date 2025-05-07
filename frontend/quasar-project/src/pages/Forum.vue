<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="q-gutter-md">
      <div class="row q-col-gutter-lg">
        
        <!-- Sidebar -->
        <div class="col-3">
          <Sidebar @sort="handleSort" />
        </div>

        <!-- Glavni sadržaj -->
        <div class="col-6">
          <q-btn label="Novi članak" color="primary" class="q-mb-md" @click="showNewArticle = true" />

          <!-- Lista članaka -->
          <q-card v-for="art in articles" :key="art.id" class="q-mb-md">
            <q-card-section>
              <div class="text-h6">{{ art.title }}</div>
              <div class="text-caption text-grey">
                {{ art.author }} · {{ art.category }} · {{ art.time }} · {{ art.date }}
              </div>
              <div class="q-mt-sm">{{ art.text }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="text-caption">{{ art.comments.length }} komentara</div>

              <div
                v-for="(comment, index) in art.comments"
                :key="index"
                class="q-mt-xs"
              >
                <div class="text-caption">
                  {{ comment.author }} · {{ comment.time }} · {{ comment.date }}
                </div>

                <!-- Ako uređujemo, prikaži input -->
                <div v-if="editingComment.articleId === art.id && editingComment.index === index">
                  <q-input v-model="editingComment.text" dense filled autofocus />
                  <div class="q-mt-sm">
                    <q-btn label="Spremi" color="positive" dense @click="saveComment(art.id, index)" />
                    <q-btn label="Odustani" dense flat @click="cancelEdit" />
                  </div>
                </div>
                <!-- Inače samo tekst komentara -->
                <div v-else>
                  <div>{{ comment.text }}</div>
                  <q-btn dense flat size="sm" label="Uredi" @click="editComment(art.id, index, comment.text)" />
                  <q-btn dense flat size="sm" color="negative" label="Obriši" @click="deleteComment(art.id, index)" />
                </div>
              </div>

              <!-- Novi komentar -->
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

            <q-card-actions>
              <q-btn flat icon="thumb_up" label="1" />
            </q-card-actions>
          </q-card>

          <!-- Paginacija -->
          <q-pagination
            v-model="page"
            :max="3"
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
              <q-btn label="Saznaj kako ih zaraditi" flat class="q-mt-sm" />
            </q-card-section>
          </q-card>

          <q-card>
            <q-card-section>
              <div class="text-subtitle2">Bodovi</div>
              <div class="text-caption">
                Ovaj ogledni tekst opisuje kako se bodovi zarađuju na forumu. Objavom ili lajkom možeš ih skupiti.
              </div>
              <q-btn label="Shvaćam" color="primary" flat class="q-mt-sm" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Dialog za dodavanje novog članka -->
    <q-dialog v-model="showNewArticle">
      <NewArticleForm
        @submitted="addArticle"
        @cancel="showNewArticle = false"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import Sidebar from 'components/Sidebar.vue'
import { ref, reactive } from 'vue'
import NewArticleForm from 'components/NewArticleForm.vue'

const page = ref(1)
const showNewArticle = ref(false)
const points = ref(245)
const newComments = reactive({})
const editingComment = reactive({
  articleId: null,
  index: null,
  text: ''
})

const articles = ref([
  {
    id: 1,
    title: 'Naslov članka',
    author: 'Ime Prezime',
    category: 'Kategorija',
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
    category: 'Kategorija',
    time: '14:30',
    date: '24.3.2025.',
    text: 'Još jedan primjer teksta objave na forumu.',
    comments: []
  }
])

function addArticle(newArt) {
  articles.value.unshift(newArt)
  showNewArticle.value = false
}

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

// Brisanje komentara
function deleteComment(articleId, index) {
  const article = articles.value.find(a => a.id === articleId)
  if (!article || index < 0 || index >= article.comments.length) return

  article.comments.splice(index, 1)
  points.value -= 1
}

// Uređivanje komentara
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

// Sortiranje članaka po datumu
function handleSort(option) {
  if (option === 'date_desc') {
    articles.value.sort((a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-')))
  } else if (option === 'date_asc') {
    articles.value.sort((a, b) => new Date(a.date.split('.').reverse().join('-')) - new Date(b.date.split('.').reverse().join('-')))
  }
}
</script>
