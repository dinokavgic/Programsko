<template>
  <q-page class="q-pa-xl bg-grey-2">
    <q-card class="q-pa-md q-mb-md shadow-1">
      <div class="text-h5 text-center text-bold">Profil</div>
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
        <q-tab name="informacije" label="Informacije" />
        <q-tab name="lozinka" label="Promjena lozinke" />
        <q-tab name="narudzbe" label="Narudžbe" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="informacije">
          <div class="text-center">
            <h2 class="text-h5">Informacije o računu</h2>
          </div>

          <q-form>
            <div class="q-gutter-md">
              <div class="q-gutter-md">
                <q-field label="Ime i Prezime">
                  <q-input v-model="imePrezime" class="full-width" />
                </q-field>
                <q-field label="E-mail">
                  <q-input v-model="email" class="full-width" readonly="" />
                </q-field>
                <q-field label="Telefon">
                  <q-input v-model="telefon" class="full-width" type="number" />
                </q-field>
              </div>

              <div class="q-row q-gutter-md">
                <q-field label="Adresa">
                  <q-input v-model="adresa" class="full-width" />
                </q-field>
                <q-field label="Mjesto">
                  <q-input v-model="mjesto" class="full-width" />
                </q-field>
                <q-field label="ZIP">
                  <q-input v-model="zip" min="0" max="99999" class="full-width" type="number" />
                </q-field>
              </div>

              <div class="q-mt-md q-gutter-md flex justify-center">
                <div class="q-btn-container">
                  <q-btn
                    label="Spremi"
                    color="primary"
                    @click="spremiProfil"
                    class="q-ml-none q-mr-auto"
                  />
                </div>
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="lozinka">
          <div class="text-center">
            <h2 class="text-h5">Promjena lozinke</h2>
          </div>

          <q-form>
            <div class="q-gutter-md">
              <div class="q-gutter-md">
                <q-field label="Stara lozinka">
                  <q-input
                    v-model="password"
                    class="full-width"
                    :type="showPassword ? 'text' : 'password'"
                    :append="showPassword ? 'visibility' : 'visibility_off'"
                    @mousedown="showPassword = true"
                    @mouseup="showPassword = false"
                    @mouseleave="showPassword = false"
                  />
                </q-field>
                <q-field label="Nova lozinka">
                  <q-input
                    v-model="newpassword"
                    class="full-width"
                    :type="showNewPassword ? 'text' : 'password'"
                    :append="showNewPassword ? 'visibility' : 'visibility_off'"
                    @mousedown="showNewPassword = true"
                    @mouseup="showNewPassword = false"
                    @mouseleave="showNewPassword = false"
                    :rules="[(val) => val.length >= 8 || 'Lozinka mora imati barem 8 znakova']"
                    hide-bottom-space
                  />
                </q-field>
                <q-field label="Potvrdite lozinku">
                  <q-input
                    v-model="confirmpassword"
                    class="full-width"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :append="showConfirmPassword ? 'visibility' : 'visibility_off'"
                    @mousedown="showConfirmPassword = true"
                    @mouseup="showConfirmPassword = false"
                    @mouseleave="showConfirmPassword = false"
                    :rules="[(val) => val === newpassword || 'Lozinke se ne podudaraju']"
                    hide-bottom-space
                  />
                </q-field>
              </div>

              <div class="q-mt-md q-gutter-md flex justify-center">
                <div class="q-btn-container">
                  <q-btn
                    label="Promijeni"
                    color="primary"
                    @click="promijeniLozinku"
                    class="q-ml-none q-mr-auto"
                  />
                </div>
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="narudzbe">
          <div class="q-pa-md">
            <div class="text-h5 q-mb-md text-center">Moje narudžbe</div>
            <div v-if="orders.length === 0" class="text-subtitle1 text-center text-grey">
              Ovdje će se prikazivati vaše narudžbe.
            </div>
            <q-scroll-area style="max-width: 100%; height: 200px">
              <div class="row no-wrap q-gutter-md">
                <q-card
                  v-for="order in sortedOrders"
                  :key="order.id"
                  class="q-pa-md col-12 col-sm-6 col-md-4"
                  style="min-width: 250px; max-width: 300px"
                  bordered
                  flat
                >
                  <div class="text-subtitle1"><strong>Broj narudžbe:</strong> {{ order.id }}</div>
                  <div class="q-mt-sm">
                    <div>
                      <strong>Status narudžbe: </strong>
                      <span
                        :class="{
                          'text-green': order.status === 'Dovršeno',
                          'text-red': order.status === 'Povučeno',
                          'text-warning': order.status === 'U obradi' || order.status === 'pending',
                        }"
                        >{{ order.status }}</span
                      >
                    </div>
                    <div class="q-mt-sm"><strong>Datum narudžbe: </strong>{{ order.time }}</div>
                    <div class="q-mt-sm"><strong>Ukupni iznos:</strong> {{ order.total }} €</div>
                  </div>
                </q-card>
              </div>
            </q-scroll-area>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'
import { db, auth } from 'src/firebase'

const authStore = useAuthStore()
const user = authStore.user

const imePrezime = ref('')
const email = ref(user?.email || '')
const telefon = ref('')
const adresa = ref('')
const mjesto = ref('')
const zip = ref('')

const activeTab = ref('informacije')
const password = ref('')
const newpassword = ref('')
const confirmpassword = ref('')

const showPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const orders = ref([])
const sortedOrders = computed(() => {
  return [...orders.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

onMounted(async () => {
  if (!user?.uid) return

  const userDocRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userDocRef)

  if (userSnap.exists()) {
    const data = userSnap.data()
    imePrezime.value = data.fullName || ''
    telefon.value = data.telefon || ''
    adresa.value = data.adresa || ''
    mjesto.value = data.mjesto || ''
    zip.value = data.zip || ''
  }
})

async function spremiProfil() {
  if (!user?.uid) return

  const userDocRef = doc(db, 'users', user.uid)

  try {
    await updateDoc(userDocRef, {
      fullName: imePrezime.value,
      telefon: telefon.value,
      adresa: adresa.value,
      mjesto: mjesto.value,
      zip: zip.value,
    })

    alert('Podaci su uspješno spremljeni.')
  } catch (error) {
    console.error('Greška pri spremanju:', error)
    alert('Greška pri spremanju podataka.')
  }
}
async function promijeniLozinku() {
  const user = auth.currentUser
  if (!user) {
    alert('Korisnik nije prijavljen.')

    return
  }

  if (newpassword.value !== confirmpassword.value) {
    alert('Lozinke se ne podudaraju.')

    return
  }

  if (newpassword.value.length < 8) {
    alert('Nova lozinka mora imati barem 8 znakova.')

    return
  }
  try {
    const credential = EmailAuthProvider.credential(user.email, password.value)
    await reauthenticateWithCredential(user, credential)

    await updatePassword(user, newpassword.value)

    alert('Lozinka je uspješno promijenjena.')

    password.value = ''
    newpassword.value = ''
    confirmpassword.value = ''
  } catch (error) {
    console.error('Greška pri promjeni lozinke:', error)
    if (error.code === 'auth/wrong-password') {
      alert('Stara lozinka nije točna.')
    } else {
      alert('Lozinka nije promijenjena.')
    }
  }
}

async function fetchOrders() {
  if (!user?.uid) return

  try {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, where('userId', '==', user.uid))
    const querySnapshot = await getDocs(q)

    orders.value = querySnapshot.docs.map((doc) => {
      const data = doc.data()

      return {
        id: doc.id,
        status: data.status || 'U obradi',
        time: data.timestamp?.toDate().toLocaleString('hr-HR') || '',
        total: data.totalPrice?.toFixed(2) || '0.00',
      }
    })
  } catch (error) {
    console.error('Greška pri dohvaćanju narudžbi:', error)
  }
}

onMounted(async () => {
  if (!user?.uid) return

  const userDocRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userDocRef)

  if (userSnap.exists()) {
    const data = userSnap.data()
    imePrezime.value = data.fullName || ''
    telefon.value = data.telefon || ''
    adresa.value = data.adresa || ''
    mjesto.value = data.mjesto || ''
    zip.value = data.zip || ''
  }

  await fetchOrders()
})
</script>
