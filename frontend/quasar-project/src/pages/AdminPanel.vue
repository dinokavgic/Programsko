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
              ref="uploaderRef"
              v-model="slike"
              label="Fotografije"
              multiple
              accept="image/*"
              auto-upload="false"
              style="max-width: 300px"
            />

            <q-input
              filled
              v-model="novaSlikaUrl"
              label="URL slike"
              outlined
              dense
              class="q-mt-md"
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
import { db, storage } from 'src/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ref } from 'vue'

const activeTab = ref('dodajProizvod')

const naziv = ref('')
const opis = ref('')
const cijena = ref(null)
const slike = ref([])
const uploaderRef = ref(null)
const novaSlikaUrl = ref('')
const slikeUrls = ref([])

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

const spremiProizvod = async () => {
  const url = novaSlikaUrl.value.trim()
  if (url) {
    slikeUrls.value.push(url)
    novaSlikaUrl.value = ''
  }
  try {
    if (!naziv.value || !opis.value || !cijena.value || !kategorija.value) {
      alert('Molimo ispunite sva polja.')

      return
    }

    const imageUrls = []
    for (const slika of slike.value) {
      const file = slika.file
      const fileRef = storageRef(storage, `products/${Date.now()}_${file.name}`)
      await uploadBytes(fileRef, file)
      const url = await getDownloadURL(fileRef)
      imageUrls.push(url)
    }

    await addDoc(collection(db, 'products'), {
      name: naziv.value,
      description: opis.value,
      price: parseFloat(cijena.value),
      category: kategorija.value,
      images: slikeUrls.value,
      createdAt: new Date(),
    })

    naziv.value = ''
    opis.value = ''
    cijena.value = null
    kategorija.value = null
    slike.value = []
    uploaderRef.value.reset()
    novaSlikaUrl.value = ''

    alert('Proizvod je uspješno dodan!')
  } catch (err) {
    console.error('Greška pri dodavanju proizvoda:', err)
    alert('Došlo je do greške pri spremanju proizvoda.')
  }
}
</script>
