import { doc, updateDoc, increment } from 'firebase/firestore'
import { db } from 'src/firebase'

export async function dodajBodKorisniku(uid) {
  if (!uid) return
  const userDocRef = doc(db, 'users', uid)
  try {
    await updateDoc(userDocRef, { bodovi: increment(1) })
  } catch (error) {
    console.error('Greška kod dodavanja boda:', error)
  }
}

export async function oduzmiBodKorisniku(uid) {
  if (!uid) return
  const userDocRef = doc(db, 'users', uid)
  try {
    await updateDoc(userDocRef, { bodovi: increment(-1) })
  } catch (error) {
    console.error('Greška kod oduzimanja boda:', error)
  }
}
