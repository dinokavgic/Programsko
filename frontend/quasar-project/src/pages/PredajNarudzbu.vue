<template>
  <q-page class="q-pa-xl bg-grey-2 flex flex-center">
    <div style="max-width: 60%; width: 100%; height: 80vh; overflow: hidden">
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
          <div>
            <h5 class="q-mt-none q-mb-md">Pregled</h5>
            <q-separator></q-separator>
            <div class="row q-gutter-sm q-mt-md">
              <q-btn label="Natrag" color="grey" @click="step--" />
              <q-btn label="Predaj narudžbu" color="green" />
            </div>
          </div>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const step = ref(1)
const useMyAddress = ref(false)
const koristiBodove = ref(false)
const bodovi = 245
const ustedjeniIznos = (bodovi * 0.01).toFixed(2)
const selectedPayment = ref(null)
const selectedDelivery = ref(null)

const address = ref({
  adresa: '',
  mjesto: '',
  zip: '',
  telefon: '',
})

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
    description: 'gotovina ili kartica +2.50%',
    icon: 'attach_money',
  },
  {
    value: 'paypal',
    label: 'PayPal',
    description: '+3.00% provizije',
    icon: 'account_balance_wallet',
  },
]

const deliveryOptions = [
  {
    value: 'fast',
    label: 'Brza dostava',
    description: '+besplatno osiguranje paketa',
    icon: 'local_shipping',
  },
]
</script>

<style scoped>
.q-stepper {
  max-width: 900;
  margin: auto;
}
</style>
