<template>
  <q-page class="q-pa-xl bg-grey-2">
    <q-card class="q-pa-md q-mb-md shadow-1">
      <div class="text-h5 text-center text-bold">Administratorska ploča</div>
    </q-card>

    <q-card class="q-pa-md">
      <q-tabs
        v-model="activeTab"
        class="text-primary"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="dodajProizvod" label="Dodaj proizvod" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="dodajProizvod">
          <q-form class="q-gutter-md">
            <q-input filled v-model="naziv" label="Naziv" outlined dense />

            <div class="row items-end">
              <div class="col">
                <q-select
                  filled
                  v-model="kategorija"
                  :options="kategorije"
                  label="Kategorija"
                  outlined
                  dense
                  emit-value
                  map-options
                />
              </div>
              <div>
                <q-btn dense flat color="primary" icon="add" @click="dodajKategoriju" />
              </div>
            </div>
            <q-input
              v-if="dodavanjeKategorije"
              v-model="novaKategorija"
              label="Nova kategorija"
              outlined
              dense
              filled
              class="q-mt-sm"
            >
              <template v-slot:append>
                <q-btn dense flat icon="check" @click="potvrdiKategoriju" />
                <q-btn dense flat icon="close" @click="dodavanjeKategorije = false" />
              </template>
            </q-input>

            <q-input filled v-model="opis" label="Opis" type="textarea" outlined dense />

            <q-input
              filled
              v-model="cijena"
              label="Cijena"
              type="number"
              prefix="€"
              outlined
              dense
              min="0"
              style="max-width: 300px"
            />

            <q-uploader
              label="Fotografije"
              multiple
              accept="image/*"
              auto-upload="false"
              style="max-width: 300px"
            />

            <div class="q-mt-md q-gutter-md flex justify-center">
              <div class="q-btn-container">
                <q-btn label="Spremi" color="primary" class="q-ml-none q-mr-auto" />
              </div>
            </div>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
const activeTab = ref('dodajProizvod')
const dodavanjeKategorije = ref(false)
const novaKategorija = ref('')
const kategorije = ref(['Kave', 'Aparati', 'Filteri']) //hvatat ce se iz firebase-a, ovo su testni podaci
const kategorija = ref(null)
const dodajKategoriju = () => {
  dodavanjeKategorije.value = true
  novaKategorija.value = ''
}

const potvrdiKategoriju = () => {
  const nova = novaKategorija.value.trim()
  if (nova && !kategorije.value.includes(nova)) {
    kategorije.value.push(nova)
    kategorija.value = nova // automatski odaberi novu
  }
  dodavanjeKategorije.value = false
}
</script>
