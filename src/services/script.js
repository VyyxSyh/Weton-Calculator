const today = new Date();

let neptuUserAktif = null;
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let firstDayIndex;
let totalDays;

let wetonUser = {
    hari: null,    
    pasaran: null, 
    neptu: 0        
};

const NEPTU_HARI = {
    senin: 4,
    selasa: 3,
    rabu: 7,
    kamis: 8,
    jumat: 6,
    sabtu: 9,
    minggu: 5
};

const NEPTU_PASARAN = {
    legi: 5,
    pahing: 9,
    pon: 7,
    wage: 4,
    kliwon: 8
};

const PANCA_SUDA = {
    1: { 
        nama: 'SRI', 
        arti: 'Baik. Rejeki, kemakmuran.', 
        kelas: 'hijau' 
    },
    2: { 
        nama: 'LUNGGUH', 
        arti: 'Baik. Kedudukan, dihormati.', 
        kelas: 'hijau' 
    },
    3: { 
        nama: 'GEDHONG', 
        arti: 'Baik. Harta, simpanan aman.', 
        kelas: 'hijau' 
    },
    4: { 
        nama: 'LORO', 
        arti: 'Buruk. Sakit, halangan.', 
        kelas: 'merah' 
    },
    0: { 
        nama: 'PATI', 
        arti: 'Buruk. Sial, mendekati bahaya.', 
        kelas: 'hitam' 
    }
};

const WARNA_KELAS = {
    hijau: { dot: "bg-emerald-500", hover: "hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:shadow-[0_0_15px_2px_rgba(16,185,129,0.5)]" },
    merah: { dot: "bg-red-500", hover: "hover:bg-red-50 dark:hover:bg-red-950 hover:shadow-[0_0_15px_2px_rgba(239,68,68,0.5)]" },
    hitam: { dot: "bg-gray-800 dark:bg-slate-950", hover: "hover:bg-gray-100 dark:hover:bg-slate-950 hover:shadow-[0_0_15px_2px_rgba(0,0,0,0.7)]" }
};

// Fungsi untuk mendapatkan nama bulan berdasarkan indeks
function getNamaBulan(index) {
    const namaBulanIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return namaBulanIndo[index];
}

// Fungsi untuk mengambil data kalender dari file JSON
function updateKalender() {
    const firstDayDate = new Date(currentYear, currentMonth, 1);
    firstDayIndex = firstDayDate.getDay();
    totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
}

// Fungsi untuk menghitung nilai Neptu berdasarkan hari dan pasaran
function hitungNeptuUser(hari, pasaran) {
    // Pakai toLowerCase() biar aman dari huruf besar/kecil
    const nHari = NEPTU_HARI[hari.toLowerCase()];
    const nPasaran = NEPTU_PASARAN[pasaran.toLowerCase()];
    
    return nHari + nPasaran;
}

// Fungsi untuk menghitung nilai Neptu target berdasarkan hari dan pasaran
function hitungNeptuTarget(hariTarget, pasaranTarget) {
    const nHari = NEPTU_HARI[hariTarget.toLowerCase()];
    const nPasaran = NEPTU_PASARAN[pasaranTarget.toLowerCase()];
    
    return nHari + nPasaran;
}

// Fungsi untuk menghitung sisa bagi dari total neptu user dan target
function hitungSisaBagi(neptuUser, neptuTarget) {
    const totalKeseluruhan = neptuUser + neptuTarget;
    return totalKeseluruhan % 5;  
}

// Fungsi utama untuk menghitung Pancasuda berdasarkan input user dan target
function hitungPancasuda(neptuUser, hariTarget, pasaranTarget) {
    const nilaiNeptuTarget = hitungNeptuTarget(hariTarget, pasaranTarget);
    const sisaBagi = hitungSisaBagi(neptuUser, nilaiNeptuTarget);
    const hasilAkhir = PANCA_SUDA[sisaBagi];
    return hasilAkhir;
}

// Fungsi untuk mengambil data kalender dari file JSON
function renderKalender(dataBulanIni, neptuUser = null) {
    const calendarGrid = document.getElementById("calendar-grid");
    
    let html = "";
    
    for (let i = 0; i < firstDayIndex; i++) {
        html += `<div class="h-16"></div>`;
    }
    
    for (let day = 1; day <= totalDays; day++) {
        const dataHariIni = dataBulanIni.find(item => item.day === day);
        
        let dotHtml = "";
        let hoverClass = "";
        let namaKategoriHtml = "";
        
        if (neptuUser !== null) {
            const hasilPancasuda = hitungPancasuda(neptuUser, dataHariIni.weekday, dataHariIni.pasaran);
            const warna = WARNA_KELAS[hasilPancasuda.kelas];
            
            dotHtml = `<span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ${warna.dot} group-hover:opacity-0 transition-opacity duration-300"></span>`;
            hoverClass = `${warna.hover} group`;
            namaKategoriHtml = `<span class="hidden group-hover:block absolute bottom-1.5 right-1.5 text-[9px] sm:text-[10px] font-bold uppercase">${hasilPancasuda.nama}</span>`;
        }
        
            html += `
                <div class="relative border border-slate-200 dark:border-slate-700 rounded-lg p-2 h-16 text-xs sm:text-sm md:text-base bg-white dark:bg-slate-800 dark:text-white transition-all duration-300 cursor-pointer ${hoverClass}">
                <div class="font-semibold">${day}</div>
                <div class="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs">${dataHariIni.pasaran}</div>
                ${dotHtml}
                ${namaKategoriHtml}
            </div>
        `;
    }

    const totalKotakTerisi = firstDayIndex + totalDays;
    const sisaKotakKosong = 42 - totalKotakTerisi;

    for (let i = 0; i < sisaKotakKosong; i++) {
        html += `<div class="h-16"></div>`;    
    }

    calendarGrid.innerHTML = html;
}

function renderLegend() {
    const legendContainer = document.getElementById("legend-container");
    let html = "";
    
    for (const key in PANCA_SUDA) {
        const item = PANCA_SUDA[key];
        const warna = WARNA_KELAS[item.kelas];
        
        html += `
            <div class="border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-start gap-2 bg-white dark:bg-slate-800">
                <span class="w-3 h-3 rounded-full ${warna.dot} mt-1 flex-shrink-0"></span>
                <div>
                    <div class="font-bold text-sm dark:text-white">${item.nama}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">${item.arti}</div>
                </div>
            </div>
        `;
    }
    
    legendContainer.innerHTML = html;
}

// ==== Wheel Picker (scroll loop) untuk Hari & Pasaran ====
const WHEEL_ITEM_HEIGHT = 44; // harus sama kayak height .wheel-picker__item di style.css

const LABEL_HARI = {
    senin: "Senin", selasa: "Selasa", rabu: "Rabu", kamis: "Kamis",
    jumat: "Jumat", sabtu: "Sabtu", minggu: "Minggu"
};

const LABEL_PASARAN = {
    legi: "Legi", pahing: "Pahing", pon: "Pon", wage: "Wage", kliwon: "Kliwon"
};

// Bikin & isi list picker, digandain 3x biar bisa di-loop terus-menerus
function buildWheelPicker(listElId, items, labelMap, defaultValue) {
    const listEl = document.getElementById(listElId);
    const itemsLooped = [...items, ...items, ...items];

    listEl.innerHTML = itemsLooped
        .map(function(val) {
            const label = labelMap ? labelMap[val] : val;
            return `<div class="wheel-picker__item" data-value="${val}">${label}</div>`;
        })
        .join("");

    const startIndex = items.length + items.indexOf(defaultValue);
    listEl.parentElement.scrollTop = startIndex * WHEEL_ITEM_HEIGHT;

    return { listEl, totalAsli: items.length, items: items };
}

// Dipanggil tiap frame pas lagi scroll: kasih efek wheel 3D (rotateX + scale + fade)
// ngikutin posisi scroll secara halus, dan update dataset.value real-time
function renderWheelFrame(pickerState) {
    const container = pickerState.listEl.parentElement;
    const items = pickerState.items;
    const totalAsli = pickerState.totalAsli;
    const centerFloat = container.scrollTop / WHEEL_ITEM_HEIGHT;
    const anakItem = pickerState.listEl.children;
    const indexTerdekat = Math.round(centerFloat);

    for (let i = 0; i < anakItem.length; i++) {
        const distance = i - centerFloat;
        const absDist = Math.min(Math.abs(distance), 3);

        const scale = 1 - absDist * 0.14;
        const opacity = Math.max(1 - absDist * 0.32, 0.12);
        const rotateX = distance * 18; // derajat, biar keliatan kayak roda 3D

        anakItem[i].style.transform = `rotateX(${rotateX}deg) scale(${scale})`;
        anakItem[i].style.opacity = opacity;
        anakItem[i].classList.toggle("wheel-picker__item--center", i === indexTerdekat);
    }

    const indexAsli = ((indexTerdekat % totalAsli) + totalAsli) % totalAsli;
    container.dataset.value = items[indexAsli];
}

// Dipanggil pas scroll udah berhenti: geser balik ke salinan tengah kalau udah mepet ujung
// (efek loop tak terbatas, prosesnya instan & di luar area yang keliatan jadi gak berasa patah)
function commitWheelPosition(pickerState) {
    const container = pickerState.listEl.parentElement;
    const totalAsli = pickerState.totalAsli;
    let index = Math.round(container.scrollTop / WHEEL_ITEM_HEIGHT);

    if (index < totalAsli * 0.5) {
        index += totalAsli;
        container.scrollTop = index * WHEEL_ITEM_HEIGHT;
    } else if (index >= totalAsli * 2.5) {
        index -= totalAsli;
        container.scrollTop = index * WHEEL_ITEM_HEIGHT;
    }

    renderWheelFrame(pickerState);
}

// Pasang klik-to-select di tiap item (dipisah biar bisa dipanggil ulang pas list-nya di-rebuild)
function attachWheelItemClicks(pickerState, container) {
    pickerState.listEl.querySelectorAll(".wheel-picker__item").forEach(function(el, i) {
        el.addEventListener("click", function() {
            container.scrollTo({ top: i * WHEEL_ITEM_HEIGHT, behavior: "smooth" });
        });
    });
}

function initWheelPicker(containerId, listId, items, labelMap, defaultValue, onSettle) {
    const container = document.getElementById(containerId);
    const pickerState = buildWheelPicker(listId, items, labelMap, defaultValue);
    container.dataset.value = defaultValue;

    renderWheelFrame(pickerState);
    attachWheelItemClicks(pickerState, container);

    let sedangAnimasi = false;
    let commitTimeout;

    container.addEventListener("scroll", function() {
        // Update tampilan tiap frame biar animasinya nempel & halus ngikutin jari/scroll
        if (!sedangAnimasi) {
            sedangAnimasi = true;
            requestAnimationFrame(function() {
                renderWheelFrame(pickerState);
                sedangAnimasi = false;
            });
        }

        // Setelah scroll berhenti (gak ada event baru selama 120ms), baru commit posisi loop-nya
        clearTimeout(commitTimeout);
        commitTimeout = setTimeout(function() {
            commitWheelPosition(pickerState);
            if (typeof onSettle === "function") {
                onSettle(container.dataset.value);
            }
        }, 120);
    });

    return pickerState;
}

// Ganti isi list picker yang udah ada (misal jumlah tanggal berubah pas bulan/tahun ganti),
// tetep pakai container & listEl yang sama, cuma isinya di-refresh
function rebuildWheelPicker(pickerState, containerId, items, labelMap, defaultValue) {
    const container = document.getElementById(containerId);
    const stateBaru = buildWheelPicker(pickerState.listEl.id, items, labelMap, defaultValue);

    pickerState.items = stateBaru.items;
    pickerState.totalAsli = stateBaru.totalAsli;
    container.dataset.value = defaultValue;

    renderWheelFrame(pickerState);
    attachWheelItemClicks(pickerState, container);
}

initWheelPicker("picker-hari", "wheel-list-hari", Object.keys(NEPTU_HARI), LABEL_HARI, "senin");
initWheelPicker("picker-pasaran", "wheel-list-pasaran", Object.keys(NEPTU_PASARAN), LABEL_PASARAN, "legi");

// ==== Wheel Picker untuk Tanggal Lahir (Tanggal - Bulan - Tahun) ====
const LABEL_BULAN = {
    "1": "Januari", "2": "Februari", "3": "Maret", "4": "April",
    "5": "Mei", "6": "Juni", "7": "Juli", "8": "Agustus",
    "9": "September", "10": "Oktober", "11": "November", "12": "Desember"
};

const ITEMS_BULAN = Object.keys(LABEL_BULAN);
const ITEMS_TAHUN = Array.from({ length: 2045 - 1970 + 1 }, function(_, i) { return String(1970 + i); });

// Hitung jumlah hari dalam sebuah bulan (nangkep tahun kabisat juga otomatis)
function getJumlahHariDalamBulan(bulan, tahun) {
    return new Date(tahun, bulan, 0).getDate();
}

function buatItemsTanggal(jumlahHari) {
    return Array.from({ length: jumlahHari }, function(_, i) { return String(i + 1); });
}

// Dipanggil tiap kali picker Bulan atau Tahun selesai di-scroll:
// nyesuaiin ulang jumlah tanggal (28/29/30/31), dan kalau tanggal yang lagi
// dipilih user "gak nakal" jadi ngelewatin batas bulan itu (misal 31 di bulan April), otomatis di-clamp
function sesuaikanTanggalMaksimal() {
    const bulanTerpilih = parseInt(document.getElementById("picker-bulan-lahir").dataset.value);
    const tahunTerpilih = parseInt(document.getElementById("picker-tahun-lahir").dataset.value);
    const jumlahHari = getJumlahHariDalamBulan(bulanTerpilih, tahunTerpilih);

    const tanggalSaatIni = parseInt(document.getElementById("picker-tanggal-lahir").dataset.value);
    const tanggalTervalidasi = Math.min(tanggalSaatIni, jumlahHari);

    rebuildWheelPicker(
        pickerTanggalLahirState,
        "picker-tanggal-lahir",
        buatItemsTanggal(jumlahHari),
        null,
        String(tanggalTervalidasi)
    );
}

const pickerTanggalLahirState = initWheelPicker("picker-tanggal-lahir", "wheel-list-tanggal-lahir", buatItemsTanggal(31), null, "1");
initWheelPicker("picker-bulan-lahir", "wheel-list-bulan-lahir", ITEMS_BULAN, LABEL_BULAN, "1", sesuaikanTanggalMaksimal);
initWheelPicker("picker-tahun-lahir", "wheel-list-tahun-lahir", ITEMS_TAHUN, null, "2000", sesuaikanTanggalMaksimal);

updateKalender();

// Update label bulan-tahun saat pertama kali load
document.getElementById("bulan-tahun-label").textContent = `${getNamaBulan(currentMonth)} ${currentYear}`;

// Event listener for the next month button
document.getElementById("next-month").addEventListener("click", function() {
    if (currentYear === 2045 && currentMonth === 11) {
        document.getElementById("next-month").disabled = true;
        return;
    }
    
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateKalender();
    ambilDataKalender(neptuUserAktif);
    document.getElementById("bulan-tahun-label").textContent = `${getNamaBulan(currentMonth)} ${currentYear}`;
});

// Event listener for the prev month button
document.getElementById("prev-month").addEventListener("click", function() {
    if (currentYear === 1970 && currentMonth === 0) {
        document.getElementById("prev-month").disabled = true;
        return;
    }

    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateKalender();
    ambilDataKalender(neptuUserAktif);
    document.getElementById("bulan-tahun-label").textContent = `${getNamaBulan(currentMonth)} ${currentYear}`;
});

// State mode input yang lagi aktif (gantiin .value dari select lama)
let modeAktif = null;

const MODE_BTN_ACTIVE = ["bg-sky-500", "hover:bg-sky-600", "text-white", "border-sky-500"];
const MODE_BTN_INACTIVE = ["text-slate-600", "dark:text-slate-300", "hover:bg-slate-100", "dark:hover:bg-slate-800"];

// Untuk menampilkan bulan dan tahun saat ini di label
document.querySelectorAll(".mode-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
        modeAktif = this.dataset.mode;

        document.querySelectorAll(".mode-btn").forEach(function(b) {
            b.classList.remove(...MODE_BTN_ACTIVE);
            b.classList.add(...MODE_BTN_INACTIVE);
        });
        this.classList.remove(...MODE_BTN_INACTIVE);
        this.classList.add(...MODE_BTN_ACTIVE);

        const sectionHariPasaran = document.getElementById("section-hari-pasaran");
        const sectionTanggalLahir = document.getElementById("section-tanggal-lahir");

        if (modeAktif === "hari-pasaran") {
            sectionHariPasaran.classList.remove("hidden");
            sectionTanggalLahir.classList.add("hidden");
        } else if (modeAktif === "tanggal-lahir") {
            sectionHariPasaran.classList.add("hidden");
            sectionTanggalLahir.classList.remove("hidden");
        }
    });
});

// Event listener for the "Hitung" button
document.getElementById("btn-hitung").addEventListener("click", async function() {
    const mode = modeAktif;
    let neptuUser = null;
    
    if (mode === "hari-pasaran") {
        const hariUser = document.getElementById("picker-hari").dataset.value;
        const pasaranUser = document.getElementById("picker-pasaran").dataset.value;

        neptuUser = hitungNeptuUser(hariUser, pasaranUser);

        document.getElementById("hasil-info").textContent = `Neptu Kamu : ${neptuUser} (${hariUser} ${pasaranUser})`;

    } else if (mode === "tanggal-lahir") {
        const tanggalLahir = parseInt(document.getElementById("picker-tanggal-lahir").dataset.value);
        const bulanLahir = parseInt(document.getElementById("picker-bulan-lahir").dataset.value);
        const tahunLahir = parseInt(document.getElementById("picker-tahun-lahir").dataset.value);

        if (tahunLahir >= 1970 && tahunLahir <= 2045) {
            // Ambil dari JSON lokal
            const response = await fetch(`/calendar/calendar_${tahunLahir}.json`);
            const data = await response.json();
            
            const namaBulan = ["january", "february", "march", "april", "may", "june", 
                            "july", "august", "september", "october", "november", "december"];
            const bulanNama = namaBulan[bulanLahir - 1];
            
            const dataBulan = data[bulanNama];
            const dataHariLahir = dataBulan.find(item => item.day === tanggalLahir);
            
            neptuUser = hitungNeptuUser(dataHariLahir.weekday, dataHariLahir.pasaran); 

            document.getElementById("hasil-info").textContent = `Neptu kamu: ${neptuUser} (${dataHariLahir.weekday} ${dataHariLahir.pasaran})`; 
            
        } else {
            document.getElementById("hasil-info").textContent = "Maaf, saat ini kalender hanya mendukung tahun 1970-2045. Coba input tanggal lahir dalam rentang tersebut.";
        }
    }

    if (neptuUser !== null) {
        neptuUserAktif = neptuUser;
        const bulanTargetInput = document.getElementById("input-bulan-target").value; // format: "2026-07"
        const bagianTarget = bulanTargetInput.split("-");
        
        currentYear = parseInt(bagianTarget[0]);
        currentMonth = parseInt(bagianTarget[1]) - 1; // kenapa -1 lagi di sini? coba inget alasan yg sama kayak sebelumnya
        
        updateKalender();
        ambilDataKalender(neptuUser);
        document.getElementById("bulan-tahun-label").textContent = `${getNamaBulan(currentMonth)} ${currentYear}`;

        document.getElementById("form-input-section").classList.add("hidden");
        document.getElementById("btn-ubah-weton").classList.remove("hidden");
        document.getElementById("legend-section").classList.remove("hidden");
        document.getElementById("btn-download").classList.remove("hidden");
    }
});

// Event listener for the "Ubah Weton" button       
document.getElementById("btn-ubah-weton").addEventListener("click", function() {
    neptuUserAktif = null;
    document.getElementById("form-input-section").classList.remove("hidden");
    document.getElementById("btn-ubah-weton").classList.add("hidden");
    document.getElementById("legend-section").classList.add("hidden");
    document.getElementById("btn-download").classList.add("hidden");
    
    ambilDataKalender();
    document.getElementById("hasil-info").textContent = "";
});

renderLegend();

document.getElementById("dn").addEventListener("change", function() {
    document.documentElement.classList.toggle("dark", this.checked);
});

document.getElementById("btn-download").addEventListener("click", function() {
    const area = document.getElementById("area-screenshot");
    const isDark = document.documentElement.classList.contains("dark");
    
    html2canvas(area, {
        backgroundColor: isDark ? "#0f172a" : "#f8fafc"
    }).then(function(canvas) {
        const link = document.createElement("a");
        link.download = `weton-${getNamaBulan(currentMonth)}-${currentYear}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});