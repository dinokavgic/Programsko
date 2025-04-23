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
                'cursor-pointer': true,
                'border-selected': selectedPayment === option.value,
              }"
              flat
              bordered
              @click="selectedPayment = option.value"
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
            :label="`Koristi moje bodove za kupnju (${bodovi}) i uštedi (${ustedjeniIznos} €).`"
          />

          <div class="row q-gutter-sm q-mt-md">
            <q-btn label="Natrag" color="grey" @click="step--" />
            <q-btn
              label="Dalje"
              color="primary"
              @click="step++"
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
                <div>{{ userData.fullName }}</div>
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
              <q-btn label="Predaj narudžbu" color="green" @click="submitOrder" />
            </div>
          </div>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'

const step = ref(1)
const useMyAddress = ref(false)
const koristiBodove = ref(false)
const bodovi = 245
const ustedjeniIznos = (bodovi * 0.01).toFixed(2)
const selectedPayment = ref(null)
const selectedDelivery = ref(null)

const cartStore = useCartStore()
const cartItems = computed(() => cartStore.cartItems)

const address = ref({
  adresa: '',
  mjesto: '',
  zip: '',
  telefon: '',
})

const userData = ref({
  fullName: 'Ivan Horvat',
})

const shipping = 5.0
const paymentFee = computed(() => {
  if (selectedPayment.value === 'cod') return 1.0
  if (selectedPayment.value === 'paypal') return total.value * 0.03

  return 0
})
const pointsDiscount = computed(() => (koristiBodove.value ? bodovi * 0.01 : 0))

const total = computed(() => {
  if (Array.isArray(cartItems.value)) {
    return cartItems.value.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
  }

  return 0
})

const finalTotal = computed(() => total.value + shipping + paymentFee.value - pointsDiscount.value)

const isAddressValid = computed(
  () =>
    address.value.adresa.trim() !== '' &&
    address.value.mjesto.trim() !== '' &&
    address.value.zip.trim() !== '' &&
    address.value.telefon.trim() !== ''
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
    label: 'PayPal',
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

function submitOrder() {
  console.log('Order submitted', {
    address: address.value,
    selectedPayment: selectedPayment.value,
    selectedDelivery: selectedDelivery.value,
    finalTotal: finalTotal.value,
  })
}
</script>

<style scoped>
.q-stepper {
  max-width: 900;
  margin: auto;
}
</style>
