// 1. Impor module yang diperlukan dari firebase dan firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"

// 2. konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA9Y7W9t_3MFRj4oRybnr8MuUU8IiVC1b0",
  authDomain: "rpl2528-720aa.firebaseapp.com",
  projectId: "rpl2528-720aa",
  storageBucket: "rpl2528-720aa.firebasestorage.app",
  messagingSenderId: "715967831691",
  appId: "1:715967831691:web:475f2e70041657c2bd3e8e"
}

// 3. Inisialisasi aplikasi Firebase dan Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const messagesCollection = collection(db, "messages")

//menentukan elemen - elemen DOM yang diperlukan
const chatForm = document.getElementById("chat-form")
const usernameInput = document.getElementById("username")
const messageInput = document.getElementById("message")
const chatBox = document.getElementById("chat-box")

//fitur kirim pesan
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  
  
  const username = usernameInput.value.trim()
  const message = messageInput.value.trim()
  if (username && message) {
    //kirim ke firestore
    try {
      await addDoc(messagesCollection, {
        username: username,
        message: message,
        waktu: serverTimestamp()
      })
      //bersihkan input setelah mengirim pesan
      messageInput.value = ""
      
    } catch (error) {
      console.log("Gagal mengirim pesan:", error)
    }
  }
})

// fitur pesan Listener (Realtime)
const queryPesan = query(messagesCollection, orderBy("waktu", "asc"))

onSnapshot(queryPesan, (snapshot) => {

  // bersihkan chatBox sebelum menampilkan pesan baru
chatBox.innerHTML = ""
  
  // tampilkan pesan baru di chatBo
  snapshot.forEach((doc) => {
// ambil data dari dokumen
    const data = doc.data()

    //membuat tampilan waktu
    const waktu = data.waktu.toDate().toLocaleTimeString(
      [],
      { hour: '2-digit', minute: '2-digit' }
      )

    // render pesan(memanggik fungsi renderpesan)
    renderPesan(data.username, data.message, waktu )
    
  })
  // scroll chatBox ke bawah setip kali ada pesan baru
  chatBox.scrollTop = chatBox.scrollHeight
})

function renderPesan(username, message, waktu) {
  // buat elemen untuk menampilkan pesan 
  const messageDiv = document.createElement("div")
  messageDiv.classList.add("message-card")
  const warnaUser = stringToColor(username)

  //menambahkan konten pesan ke messageDiv
  messageDiv.innerHTML = `
  <div class="message-content">
  <strong style="color: ${warnaUser}">${username}</strong>
  <span>${message}</span>
  
  </div>
  <span class="time">${waktu}</span>
  ` // backtik

  //menambahkan messageDiv ke ChatBox
  chatBox.appendChild(messageDiv)
}

// Fungsi untuk mengubah String Nama menjadi Warna (HSL) yang Konsisten
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Ambil nilai Hue 0 - 360, dengan Saturation 65% & Lightness 40% agar warna tetap kontras/jelas
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 40%)`;
}