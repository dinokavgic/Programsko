<template>
  <q-page class="q-pa-xl bg-grey-2 flex flex-center" style="overflow-y: auto">
    <div style="max-width: 60%; width: 100%; height: 80vh">
      <q-stepper v-model="step" flat animated>
        <q-step :name="1" title="Adresa dostave" subtitle="Odaberi opcije" :done="step > 1">
          <q-form @submit.prevent="goToNextStep" ref="addressForm" class="q-gutter-md">
            <h5 class="q-mb-none q-mt-none">Adresa dostave</h5>
            <q-separator></q-separator>
            <q-toggle v-model="useMyAddress" label="Koristi moju spremljenu adresu." />
            <div class="row">
              <q-input
                class="col"
                v-model="address.fullName"
                label="Ime i prezime"
                outlined
                required
              />
            </div>
            <div class="row">
              <q-input
                class="col q-mr-md"
                v-model="address.adresa"
                label="Adresa"
                outlined
                required
              />
              <q-input
                class="col"
                v-model="address.telefon"
                label="Telefon"
                outlined
                required
                min="0"
                type="number"
              />
            </div>
            <div class="row">
              <q-input
                class="col q-mr-md"
                v-model="address.mjesto"
                label="Mjesto"
                outlined
                required
              />
              <q-input
                class="col"
                v-model="address.zip"
                label="Zip"
                min="0"
                max="99999"
                type="number"
                outlined
                required
              />
            </div>

            <div class="q-mt-lg">
              <q-btn label="Dalje" color="primary" type="submit" :disable="!isAddressValid" />
            </div>
          </q-form>
        </q-step>

        <q-step
          :name="2"
          title="Dostavljanje i plaćanje"
          subtitle="Odaberi način dostave i plaćanja"
          :done="step > 2"
        >
          <h5 class="q-mb-md q-mt-none">Način plaćanja</h5>
          <q-separator></q-separator>
          <div class="q-gutter-md row q-mt-xs q-mb-md">
            <q-card
              v-for="option in paymentOptions"
              :key="option.value"
              :class="{
                'bg-blue-1': selectedPayment === option.value,
                'cursor-pointer': option.value !== 'paypal',
                'border-selected': selectedPayment === option.value,
                'disabled-card': option.value === 'paypal',
              }"
              flat
              bordered
              @click="option.value !== 'paypal' && (selectedPayment = option.value)"
            >
              <q-card-section class="row items-center">
                <q-icon :name="option.icon" size="md" class="q-mr-md" />
                <div>
                  <div class="text-subtitle1">{{ option.label }}</div>
                  <div class="text-caption text-grey">
                    {{ option.description }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <h5 class="q-mb-md q-mt-none">Dostava</h5>
          <q-separator></q-separator>
          <div class="q-gutter-md row q-mt-xs">
            <q-card
              v-for="option in deliveryOptions"
              :key="option.value"
              :class="{
                'bg-blue-1': selectedDelivery === option.value,
                'cursor-pointer': true,
                'border-selected': selectedDelivery === option.value,
              }"
              flat
              bordered
              @click="selectedDelivery = option.value"
            >
              <q-card-section class="row items-center">
                <q-icon :name="option.icon" size="md" class="q-mr-md" />
                <div>
                  <div class="text-subtitle1">{{ option.label }}</div>
                  <div class="text-caption text-grey">
                    {{ option.description }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <h5 class="q-mb-md q-mt-md">Pogodnosti</h5>
          <q-separator class="q-mb-xs"></q-separator>
          <q-toggle
            v-model="koristiBodove"
            :label="
              koristiBodove
                ? `Iskoristit ćeš (${iskoristeniBodovi}) bodova i uštedjeti (${pointsDiscount.toFixed(2)} €).`
                : `Koristi moje bodove (${bodovi}) za ovu kupnju.`
            "
            :disable="bodovi === 0"
          />

          <div class="row q-gutter-sm q-mt-md">
            <q-btn label="Natrag" color="grey" @click="step--" />
            <q-btn
              label="Dalje"
              color="primary"
              @click="
                () => {
                  if (selectedPayment && selectedDelivery) step++
                }
              "
              :disable="!selectedDelivery || !selectedPayment"
            />
          </div>
        </q-step>

        <q-step :name="3" title="Pregled narudžbe" subtitle="Završi narudžbu">
          <div style="max-height: 100%; height: 67vh; overflow-y: auto; padding-right: 8px">
            <h5 class="q-mt-none q-mb-md">Pregled</h5>
            <q-separator />

            <div class="q-mt-md q-mb-md">
              <q-field label="Ime i prezime" stack-label readonly>
                <div>{{ address.fullName }}</div>
              </q-field>
              <q-field label="Adresa" stack-label readonly>
                <div>{{ address.adresa }}</div>
              </q-field>
              <q-field label="Mjesto" stack-label readonly>
                <div>{{ address.mjesto }}</div>
              </q-field>
              <q-field label="Poštanski broj" stack-label readonly>
                <div>{{ address.zip }}</div>
              </q-field>
              <q-field label="Telefon" stack-label readonly>
                <div>{{ address.telefon }}</div>
              </q-field>
            </div>

            <q-separator />

            <div class="q-mt-md q-mb-md">
              <div v-for="item in cartItems" :key="item.id" class="q-mb-sm">
                <div class="row justify-between">
                  <div>{{ item.name }} x{{ item.quantity }}</div>
                  <div>{{ (item.price * item.quantity).toFixed(2) }} €</div>
                </div>
              </div>
            </div>

            <q-separator spaced />

            <div class="row justify-between">
              <div>Ukupno proizvodi:</div>
              <div>{{ total.toFixed(2) }} €</div>
            </div>
            <div class="row justify-between">
              <div>Poštarina:</div>
              <div>{{ shipping.toFixed(2) }} €</div>
            </div>
            <div class="row justify-between">
              <div>{{ paymentLabel }}</div>
              <div>{{ paymentFee.toFixed(2) }} €</div>
            </div>
            <div class="row justify-between" v-if="pointsDiscount > 0">
              <div>Popust (bodovi):</div>
              <div>- {{ pointsDiscount.toFixed(2) }} €</div>
            </div>

            <q-separator spaced />

            <div class="row justify-between text-bold">
              <div>Ukupno za platiti:</div>
              <div>{{ finalTotal.toFixed(2) }} €</div>
            </div>
            <div class="row q-gutter-sm q-mt-lg">
              <q-btn label="Natrag" color="grey" @click="step--" />
              <q-btn
                label="Predaj narudžbu"
                color="green"
                @click="submitOrder"
                :disable="cartItems.length === 0"
              />
            </div>
            <OrderSuccessDialog v-if="showSuccessDialog" @close="handleDialogClose" />
          </div>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive, onUnmounted } from 'vue'
import { useCartStore } from '../stores/cart'
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore'
import { useAuthStore } from 'stores/auth'
import { db } from 'src/firebase'
import { useRouter } from 'vue-router'
import OrderSuccessDialog from 'components/OrderSuccessDialog.vue'

const step = ref(1)
const koristiBodove = ref(false)
const bodovi = computed(() => userData.value.bodovi || 0)

const selectedPayment = ref(null)
const selectedDelivery = ref(null)

const cartStore = useCartStore()
const cartItems = computed(() => cartStore.cartItems)

const authStore = useAuthStore()
const user = authStore.user
const router = useRouter()
const showSuccessDialog = ref(false)
const isOrderSuccess = ref(false)

const useMyAddress = ref(false)
//lokalni podaci
const address = reactive({
  fullName: '',
  adresa: '',
  mjesto: '',
  zip: '',
  telefon: '',
})

//firebase
const userData = ref({
  fullName: '',
  telefon: '',
  adresa: '',
  mjesto: '',
  zip: '',
  bodovi: 0,
})

const shipping = 5.0
const paymentFee = computed(() => {
  if (selectedPayment.value === 'cod') return 1.0
  if (selectedPayment.value === 'paypal') return total.value * 0.03

  return 0
})
const pointsDiscount = computed(() => {
  const maxDiscount = total.value

  return koristiBodove.value ? Math.min(bodovi.value * 0.01, maxDiscount) : 0
})

const iskoristeniBodovi = computed(() => Math.floor(pointsDiscount.value / 0.01))

const total = computed(() => {
  if (Array.isArray(cartItems.value)) {
    return cartItems.value.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
  }

  return 0
})

const finalTotal = computed(() => total.value + shipping + paymentFee.value - pointsDiscount.value)

const isAddressValid = computed(
  () =>
    address.fullName.trim() !== '' &&
    address.adresa.trim() !== '' &&
    address.mjesto.trim() !== '' &&
    address.zip.trim() !== '' &&
    address.telefon.trim() !== ''
)

function goToNextStep() {
  if (isAddressValid.value) {
    step.value++
  }
}

const paymentOptions = [
  {
    value: 'cod',
    label: 'Plaćanje pouzećem',
    description: 'gotovina ili kartica +1,00€',
    icon: 'attach_money',
  },
  {
    value: 'paypal',
    label: 'PayPal / nedostupno',
    description: '+3.00% provizije',
    icon: 'account_balance_wallet',
  },
]

const paymentLabel = computed(() => {
  if (selectedPayment.value === 'cod') return 'Način plaćanja (kurir)'
  if (selectedPayment.value === 'paypal') return 'Način plaćanja (PayPal)'

  return 'Način plaćanja'
})

const deliveryOptions = [
  {
    value: 'fast',
    label: 'Brza dostava',
    description: '+besplatno osiguranje paketa',
    icon: 'local_shipping',
  },
]

async function submitOrder() {
  if (koristiBodove.value && user?.uid) {
    const userDocRef = doc(db, 'users', user.uid)
    const noviBrojBodova = Math.max(0, bodovi.value - iskoristeniBodovi.value)

    try {
      await updateDoc(userDocRef, {
        bodovi: noviBrojBodova,
      })
      console.log(`Ažurirani bodovi korisnika: ${noviBrojBodova}`)
    } catch (err) {
      console.error('Greška pri ažuriranju bodova:', err)
    }
  }
  const orderData = {
    userId: user.uid,
    timestamp: serverTimestamp(),
    paymentMethod: selectedPayment.value,
    deliveryMethod: selectedDelivery.value,
    totalPrice: finalTotal.value,
    pointsUsed: koristiBodove.value ? bodovi.value : 0,
    address: {
      fullName: address.fullName,
      adresa: address.adresa,
      mjesto: address.mjesto,
      zip: address.zip,
      telefon: address.telefon,
    },
    items: cartItems.value.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    status: 'U obradi',
  }
  try {
    await addDoc(collection(db, 'orders'), orderData)
    for (const item of cartItems.value) {
      const productRef = doc(db, 'products', item.id)
      try {
        const productSnap = await getDoc(productRef)
        if (productSnap.exists()) {
          const currentStock = productSnap.data().inStock ?? 0
          const newStock = Math.max(0, currentStock - item.quantity)

          await updateDoc(productRef, {
            inStock: newStock,
          })
        }
      } catch (err) {
        console.error(`Greška pri ažuriranju zalihe za proizvod ${item.id}:`, err)
      }
    }
    isOrderSuccess.value = true
    showSuccessDialog.value = true

  } catch (error) {
    console.error('Greška pri spremanju narudžbe:', error)
    alert('Došlo je do pogreške. Pokušajte ponovno.')
  }
}

function handleDialogClose() {
  cartStore.clearCart()
  isOrderSuccess.value = false
  router.push('/')
}

let unsubscribe = null

onMounted(async () => {
  if (user?.uid) {
    const userDocRef = doc(db, 'users', user.uid)
    unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        userData.value = {
          fullName: data.fullName || '',
          telefon: data.telefon || '',
          adresa: data.adresa || '',
          mjesto: data.mjesto || '',
          zip: data.zip || '',
          bodovi: data.bodovi || 0,
        }
      }
    })
  }
})
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

watch(useMyAddress, (val) => {
  if (val) {
    address.fullName = userData.value.fullName
    address.telefon = userData.value.telefon
    address.adresa = userData.value.adresa
    address.mjesto = userData.value.mjesto
    address.zip = userData.value.zip
  } else {
    address.fullName = ''
    address.telefon = ''
    address.adresa = ''
    address.mjesto = ''
    address.zip = ''
  }
})

watch(cartItems, (newItems) => {
  if (newItems.length === 0 && !isOrderSuccess.value) {
    alert('Košarica je prazna. Preusmjeravamo vas na početnu stranicu.')
    router.push('/')
  }
})
</script>

<style scoped>
.q-stepper {
  max-width: 900;
  margin: auto;
}
.disabled-card {
  opacity: 0.5;
  pointer-events: none;
}
</style>
