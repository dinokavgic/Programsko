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
        <q-tab name="dodajProizvod" label="Dodaj proizvod" data-testid="tab-dodaj-proizvod" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="dodajProizvod">
          <q-form class="q-gutter-md">
            <q-input
              filled
              v-model="naziv"
              label="Naziv"
              outlined
              dense
              data-testid="input-naziv"
            />

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
                <q-btn
                  dense
                  flat
                  color="primary"
                  icon="add"
                  @click="dodajKategoriju"
                  data-testid="dodaj-kategoriju"
                />
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
              data-testid="input-nova-kategorija"
            >
              <template v-slot:append>
                <q-btn dense flat icon="check" @click="potvrdiKategoriju" />
                <q-btn dense flat icon="close" @click="dodavanjeKategorije = false" />
              </template>
            </q-input>

            <q-input
              filled
              v-model="opis"
              label="Opis"
              type="textarea"
              outlined
              dense
              data-testid="input-opis"
            />

            <q-input
              filled
              v-model.number="cijena"
              label="Cijena"
              type="number"
              prefix="€"
              outlined
              dense
              min="0"
              style="max-width: 300px"
            />

            <q-uploader
              ref="uploaderRef"
              v-model="slike"
              label="Fotografije"
              multiple
              accept="image/*"
              :filter="filterSlike"
              :auto-upload="false"
              style="max-width: 300px"
              @added="dodajSlike"
            />

            <q-input
              filled
              v-model.number="stanje"
              label="Zaliha"
              type="number"
              step="1"
              outlined
              dense
              class="q-mt-md"
              min="0"
              style="max-width: 300px"
            ></q-input>

            <div class="q-mt-md q-gutter-md flex justify-center">
              <div class="q-btn-container">
                <q-btn
                  label="Spremi"
                  color="primary"
                  @click="spremiProizvod"
                  class="q-ml-none q-mr-auto"
                />
              </div>
            </div>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { db } from 'src/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { ref } from 'vue'

const activeTab = ref('dodajProizvod')

const slike = ref([])
const naziv = ref('')
const opis = ref('')
const cijena = ref(null)
const slikeFiles = ref([])
const uploaderRef = ref(null)
const stanje = ref(null)

const dodavanjeKategorije = ref(false)
const novaKategorija = ref('')
const kategorije = ref(['Kave', 'Aparati', 'Filteri'])
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

const spremiProizvod = async () => {
  try {
    const stanjeInt = Math.floor(Number(stanje.value))
    if (
      !naziv.value ||
      !opis.value ||
      !cijena.value ||
      cijena.value === null ||
      isNaN(cijena.value) ||
      !kategorija.value ||
      stanje.value === null ||
      isNaN(stanjeInt)
    ) {
      alert('Molimo ispunite sva polja.')

      return
    }

    const imageBase64List = await Promise.all(slikeFiles.value.map((file) => toBase64(file)))

    await addDoc(collection(db, 'products'), {
      name: naziv.value,
      description: opis.value,
      price: parseFloat(cijena.value),
      category: kategorija.value,
      images: imageBase64List,
      inStock: stanjeInt,
      createdAt: new Date(),
    })

    naziv.value = ''
    opis.value = ''
    cijena.value = null
    kategorija.value = null
    slikeFiles.value = []
    stanje.value = null
    uploaderRef.value.reset()

    alert('Proizvod je uspješno dodan!')
  } catch (err) {
    console.error('Greška pri dodavanju proizvoda:', err)
    alert('Došlo je do greške pri spremanju proizvoda.')
  }
}

const filterSlike = (files) => {
  const maxSize = 1024 * 1024 // 1MB
  const valid = []
  const tooBig = []

  files.forEach((file) => {
    if (file.size <= maxSize) {
      valid.push(file)
    } else {
      tooBig.push(file.name)
    }
  })

  if (tooBig.length) {
    alert(`Sljedeće slike su veće od 1MB i neće biti dodane:\n${tooBig.join(', ')}`)
  }

  return valid
}
</script>
