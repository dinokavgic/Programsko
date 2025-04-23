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
            <!-- Dugme za otvaranje forme za novi članak -->
            <q-btn label="Novi članak" color="primary" class="q-mb-md" @click="showNewArticle = true" />
  
            <!-- Tvoja lista članaka -->
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
                <div v-for="(comment, index) in art.comments" :key="index" class="q-mt-xs">
                  <div class="text-caption">{{ comment.author }} · {{ comment.time }} · {{ comment.date }}</div>
                  <div>{{ comment.text }}</div>
                </div>
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
                <div class="text-h5">245 ☕</div>
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
  import { ref } from 'vue'
  import NewArticleForm from 'components/NewArticleForm.vue'
  
  // Stanje paginacije i dijaloga
  const page = ref(1)
  const showNewArticle = ref(false)
  
  // Popis članaka
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
  
  // Funkcija za dodavanje novog članka
  function addArticle(newArt) {
    articles.value.unshift(newArt) // Dodajemo članak na početak liste
    showNewArticle.value = false  // Zatvaranje dijaloga
  }
  function handleSort(option) {
  if (option === 'date_desc') {
    articles.value.sort((a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-')))
  } else if (option === 'date_asc') {
    articles.value.sort((a, b) => new Date(a.date.split('.').reverse().join('-')) - new Date(b.date.split('.').reverse().join('-')))
  }
}
  </script>