document.addEventListener('DOMContentLoaded', () => {
    // --- Semua deklarasi variabel DOM ---
    const loginPopup = document.getElementById('login-popup');
    const btnPelanggan = document.getElementById('btn-pelanggan');
    const btnKasir = document.getElementById('btn-kasir');
    const formPelanggan = document.getElementById('form-pelanggan');
    const formKasir = document.getElementById('form-kasir');
    const namaPelangganLoginInput = document.getElementById('nama-pelanggan-login');
    const alamatPelangganLoginInput = document.getElementById('alamat-pelanggan-login');
    const namaKasirLoginInput = document.getElementById('nama-kasir-login');
    const passwordKasirLoginInput = document.getElementById('password-kasir-login');
    const appContainer = document.getElementById('app-container');
    const kasirFabs = document.getElementById('kasir-fabs');
    const pesanInfoLabel = document.getElementById('pesan-info-label');
    const paymentChoiceButtons = document.getElementById('payment-choice-buttons');
    const pesanWhatsappPelangganBtn = document.getElementById('pesan-whatsapp-pelanggan');
    const cetakStrukButton = document.getElementById('cetak-struk-button');
    const namaPemesanInput = document.getElementById('nama-pemesan');
    const alamatPemesanInput = document.getElementById('alamat-pemesan');
    const keteranganPesananInput = document.getElementById('keterangan-pesanan');
    const nominalPembayaranInput = document.getElementById('nominal-pembayaran');
    const kembalianDisplay = document.getElementById('kembalian-display');
    const produkList = document.getElementById('produk-list');
    const keranjangItems = document.getElementById('keranjang-items');
    const keranjangTotal = document.getElementById('keranjang-total');
    const manualOrderModal = document.getElementById('manualOrderModal');
    const manualProductNameInput = document.getElementById('manualProductName');
    const manualProductPriceInput = document.getElementById('manualProductPrice');
    const manualProductQtyInput = document.getElementById('manualProductQty');
    const addManualOrderFab = document.getElementById('add-manual-order-fab');
    const clearCartFab = document.getElementById('clear-cart-fab');
    const btnBayarQris = document.getElementById('btn-bayar-qris');
    const shareOrderFab = document.getElementById('share-order-fab');
    const printFab = document.getElementById('print-fab');
    const printOptionsPopup = document.getElementById('print-options-popup');
    const btnPrintTunai = document.getElementById('btn-print-tunai');
    const btnPrintQris = document.getElementById('btn-print-qris');
    const closePrintPopupBtn = document.getElementById('close-print-popup');
    const productSearchBarcodeInput = document.getElementById('product-search-barcode');
    const searchBarcodeFeedback = document.getElementById('search-barcode-feedback');
    const namaPemesanModal = document.getElementById('namaPemesanModal');
    const inputNamaPemesan = document.getElementById('inputNamaPemesan');
    const diskonSection = document.getElementById('diskon-section');
    const namaDiskonInput = document.getElementById('nama-diskon');
    const nilaiDiskonInput = document.getElementById('nilai-diskon');

    // === Tambahan DOM untuk popup keranjang (F6) ===
    // Buat popup keranjang jika belum ada di HTML
    let popupKeranjang = document.getElementById('popup-keranjang');
    if (!popupKeranjang) {
        popupKeranjang = document.createElement('div');
        popupKeranjang.id = 'popup-keranjang';
        popupKeranjang.innerHTML = `
            <div class="popup-keranjang-content">
                <button id="close-popup-keranjang" title="Tutup" style="position:absolute;right:10px;top:10px;font-size:1.5em;background:none;border:none;cursor:pointer;">&times;</button>
                <h2 style="margin-top:0;margin-bottom:10px;"><i class="fas fa-shopping-cart"></i> Keranjang Belanjaan</h2>
                <div style="max-height:240px;overflow:auto;">
                    <table class="popup-keranjang-table" style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                                <th>Hapus</th>
                            </tr>
                        </thead>
                        <tbody id="popup-keranjang-items"></tbody>
                    </table>
                </div>
                <div style="margin-top:10px;">
                    <strong>Total: <span id="popup-keranjang-total">Rp0</span></strong>
                </div>
                <div style="margin-top:10px;text-align:right;">
                    <button id="popup-keranjang-print" style="background:#007bff;color:#fff;border:none;padding:8px 16px;border-radius:5px;cursor:pointer;">
                        <i class="fas fa-print"></i> Cetak Struk
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(popupKeranjang);
    }
    popupKeranjang.style.display = "none";

    // --- Data Produk ---
    const produkData = [
        { id: 1, nama: "Risol", harga: 3000, gambar: "risol.webp", barcode: "0674448829853" },
        { id: 2, nama: "Cibay", harga: 2500, gambar: "cibay.webp", barcode: "cibay" },
        { id: 3, nama: "Citung", harga: 2500, gambar: "citung.webp", barcode: "citung" },
        { id: 4, nama: "Tteokbokki", harga: 5000, gambar: "toppoki.webp", barcode: "toppoki" },
        { id: 5, nama: "Tteokbokki", harga: 10000, gambar: "toppoki.webp", barcode: "toppoki10" },
        { id: 9, nama: "Es Teh Jumbo", harga: 3000, gambar: "esteh.webp", barcode: "esteh" },
        { id: 10, nama: "Es Teh kecil", harga: 2000, gambar: "esteh.webp", barcode: "esteh2" }
    ];
    const produkDefaultHarga = produkData.map(p => ({ id: p.id, harga: p.harga }));

    let keranjang = [];
    let nextManualItemId = 1000;
    let isNominalInputFocused = false;

    function resetHargaProdukKeDefault() {
        produkDefaultHarga.forEach(def => {
            const produk = produkData.find(p => p.id === def.id);
            if (produk) produk.harga = def.harga;
        });
        localStorage.removeItem('produkHarga');
    }

    // --- Login & App Init ---
    btnPelanggan.addEventListener('click', () => {
        formPelanggan.style.display = 'flex';
        formKasir.style.display = 'none';
        namaPelangganLoginInput.focus();
    });
    btnKasir.addEventListener('click', () => {
        formKasir.style.display = 'flex';
        formPelanggan.style.display = 'none';
        namaKasirLoginInput.focus();
    });
    formPelanggan.addEventListener('submit', (event) => {
        event.preventDefault();
        const nama = namaPelangganLoginInput.value.trim();
        const alamat = alamatPelangganLoginInput.value.trim();
        if (nama && alamat) {
            localStorage.setItem('userRole', 'pelanggan');
            localStorage.setItem('namaPelanggan', nama);
            localStorage.setItem('alamatPelanggan', alamat);
            localStorage.setItem('namaPemesan', nama);
            loginPopup.style.display = 'none';
            appContainer.style.display = 'block';
            kasirFabs.style.display = 'none';
            pesanInfoLabel.style.display = 'block';
            pesanInfoLabel.textContent = "Terima kasih pelanggan setia, sehat selalu ya 🙏 tanpa anda tidak ada cerita di kedai kita. Selalu kunjungi kami ya";
            initializeApp();
        }
    });
    formKasir.addEventListener('submit', (event) => {
        event.preventDefault();
        const namaKasir = namaKasirLoginInput.value.trim();
        const passwordKasir = passwordKasirLoginInput.value.trim();
        if (namaKasir === 'Harry' && passwordKasir === '313121') {
            localStorage.setItem('userRole', 'kasir');
            localStorage.setItem('namaKasir', namaKasir);
            loginPopup.style.display = 'none';
            appContainer.style.display = 'block';
            kasirFabs.style.display = 'block';
            namaPemesanModal.style.display = 'none';
            pesanInfoLabel.style.display = 'none';
            initializeApp();
        } else {
            alert('Nama kasir atau password salah!');
        }
    });

    document.getElementById('btnSimpanNamaPemesan').onclick = function() {
        var nama = inputNamaPemesan.value.trim();
        if (nama.length < 2) { return; }
        localStorage.setItem('namaPemesan', nama);
        localStorage.setItem('namaPelanggan', nama);
        namaPemesanModal.style.display = 'none';
        autofillNamaPemesanForm();
    };
    inputNamaPemesan.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('btnSimpanNamaPemesan').click();
        }
    });

    function autofillNamaPemesanForm() {
        const nama = localStorage.getItem('namaPemesan') || '';
        const alamat = localStorage.getItem('alamatPelanggan') || '';
        if (namaPemesanInput) namaPemesanInput.value = nama;
        if (alamatPemesanInput) alamatPemesanInput.value = alamat;
    }
    function initializeApp() {
        const currentUserRole = localStorage.getItem('userRole');
        if (currentUserRole === 'kasir') {
            diskonSection.style.display = 'flex';
        } else {
            diskonSection.style.display = 'none';
            namaDiskonInput.value = '';
            nilaiDiskonInput.value = 0;
        }
        if (currentUserRole === 'pelanggan' && !localStorage.getItem('namaPemesan')) {
            namaPemesanModal.style.display = 'flex';
            inputNamaPemesan.focus();
        } else if (currentUserRole === 'kasir') {
            namaPemesanModal.style.display = 'none';
        }
        autofillNamaPemesanForm();
        displayProduk();
        updateKeranjang();
        hitungKembalian();
        updateActionButtonVisibility();
        paymentChoiceButtons.style.display = 'flex';
    }

    // --- Produk dan Keranjang (fungsi2 tetap seperti skrip sebelumnya) ---
    function displayProduk() {
        produkList.innerHTML = '';
        const currentUserRole = localStorage.getItem('userRole');
        produkData.forEach(produk => {
            let itemInCart = keranjang.find(item => item.id === produk.id && !item.isManual);
            let qty = itemInCart ? itemInCart.qty : 0;
            const produkDiv = document.createElement('div');
            produkDiv.classList.add('produk-item');
            let hargaDisplayHtml = `<p>Harga: <span class="price-display">${formatRupiah(produk.harga)}</span></p>`;
            if (currentUserRole === 'kasir') {
                hargaDisplayHtml = `
                    <p class="edit-price-wrapper">
                        Harga: 
                        <input type="number" 
                               class="product-price-input" 
                               data-id="${produk.id}" 
                               value="${produk.harga}" 
                               min="0" 
                               onchange="handlePriceChange(this, ${produk.id})"
                               onblur="formatPriceInput(this)">
                    </p>`;
            }
            produkDiv.innerHTML = `
                <img src="${produk.gambar}" alt="${produk.nama}">
                <h3>${produk.nama}</h3>
                ${hargaDisplayHtml} 
                <div class="produk-controls" id="controls-${produk.id}">
                    ${qty < 1 ? `
                        <button class="add-to-cart-btn qty-btn" data-id="${produk.id}" title="Tambah ke keranjang"><i class="fas fa-plus"></i></button>
                    ` : `
                        <button class="qty-control-btn qty-btn minus-btn" data-id="${produk.id}" data-action="minus" title="Kurangi qty">-</button>
                        <span class="qty-value">${qty}</span>
                        <button class="qty-control-btn qty-btn plus-btn" data-id="${produk.id}" data-action="plus" title="Tambah qty">+</button>
                    `}
                </div>
            `;
            produkList.appendChild(produkDiv);
        });
    }
    function updateProdukControls() { displayProduk(); }
    window.handlePriceChange = function(inputElement, produkId) {
        let newPrice = parseFloat(inputElement.value);
        if (isNaN(newPrice) || newPrice < 0) newPrice = 0;
        const produk = produkData.find(p => p.id === produkId);
        if (produk) {
            produk.harga = newPrice;
            keranjang.forEach(item => {
                if (!item.isManual && item.id === produkId) {
                    item.harga = newPrice;
                }
            });
            localStorage.setItem('produkHarga', JSON.stringify(produkData.map(p => ({ id: p.id, harga: p.harga }))));
            updateKeranjang();
        }
    };
    window.formatPriceInput = function(inputElement) {
        let value = parseFloat(inputElement.value);
        if (isNaN(value)) value = 0;
        inputElement.value = value;
    };
    produkList.addEventListener('focusin', function(e) {
        const input = e.target;
        if (input.classList.contains('product-price-input')) input.value = '';
    });
    produkList.addEventListener('keydown', function(e) {
        const input = e.target;
        if (input.classList.contains('product-price-input') && e.key === 'Enter') {
            e.preventDefault();
            const produkId = parseInt(input.dataset.id);
            window.handlePriceChange(input, produkId);
            input.blur();
        }
    });

    produkList.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        const produkId = parseInt(btn.dataset.id);
        if (btn.classList.contains('add-to-cart-btn')) {
            const product = produkData.find(p => p.id === produkId);
            if (product) tambahKeKeranjang(product);
            return;
        }
        if (btn.classList.contains('plus-btn')) {
            const itemInCart = keranjang.find(item => item.id === produkId && !item.isManual);
            if (itemInCart) {
                itemInCart.qty++;
                updateKeranjang();
                updateProdukControls();
            }
            return;
        }
        if (btn.classList.contains('minus-btn')) {
            const itemInCart = keranjang.find(item => item.id === produkId && !item.isManual);
            if (itemInCart) {
                itemInCart.qty--;
                if (itemInCart.qty <= 0) {
                    keranjang = keranjang.filter(item => !(item.id === produkId && !item.isManual));
                }
                updateKeranjang();
                updateProdukControls();
            }
            return;
        }
    });

    function tambahKeKeranjang(produkSumber) {
        let productToAdd;
        if (produkSumber.isManual) {
            productToAdd = { ...produkSumber };
        } else {
            const existingItem = keranjang.find(item => !item.isManual && item.id === produkSumber.id);
            if (existingItem) {
                existingItem.qty += (produkSumber.qty || 1);
                updateKeranjang();
                updateProdukControls();
                return;
            } else {
                productToAdd = { ...produkSumber, qty: produkSumber.qty || 1 };
            }
        }
        if (productToAdd.isManual && !productToAdd.hasOwnProperty('id')) {
            productToAdd.id = nextManualItemId++;
        } else if (!productToAdd.hasOwnProperty('id') && !productToAdd.barcode) {
            productToAdd.id = nextManualItemId++;
            productToAdd.isManual = true;
        }
        keranjang.push(productToAdd);
        updateKeranjang();
        updateProdukControls();
    }

    function updateKeranjang() {
        let total = 0;
        keranjangItems.innerHTML = '';
        if (keranjang.length === 0) {
            keranjangItems.innerHTML = '<tr><td colspan="4" class="empty-cart-message">Keranjang kosong.</td></tr>';
        } else {
            keranjang.forEach((item, index) => {
                const subtotal = item.harga * item.qty;
                total += subtotal;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.nama}</td>
                    <td>
                        <input type="number" value="${item.qty}" min="1"
                            onchange="updateCartItemQty(${index}, this.value)"
                            onfocus="clearQtyOnFocus(this, ${index})"
                        >
                    </td>
                    <td>${formatRupiah(subtotal)}</td>
                    <td><button onclick="removeFromCart(${index})" class="btn-remove-item"><i class="fas fa-trash-alt"></i></button></td>
                `;
                keranjangItems.appendChild(row);
            });
        }
        let totalSetelahDiskon = total;
        if (localStorage.getItem('userRole') === 'kasir') {
            let diskon = parseFloat(nilaiDiskonInput.value) || 0;
            if (diskon < 0) diskon = 0;
            totalSetelahDiskon = Math.max(total - diskon, 0);
        }
        keranjangTotal.textContent = formatRupiah(totalSetelahDiskon);

        // Update juga total di popup keranjang jika terbuka
        updatePopupKeranjang();
        const totalBelanjaNumeric = totalSetelahDiskon;
        if (!isNominalInputFocused) {
            const currentNominalValueNumeric = parseFloat(nominalPembayaranInput.value) || 0;
            const isCurrentlyEmptyOrZero = nominalPembayaranInput.value === '' || currentNominalValueNumeric === 0;
            if (isCurrentlyEmptyOrZero || nominalPembayaranInput.dataset.autofilled === 'true') {
                nominalPembayaranInput.value = totalBelanjaNumeric;
                if (totalBelanjaNumeric > 0) {
                    nominalPembayaranInput.dataset.autofilled = 'true';
                } else {
                    delete nominalPembayaranInput.dataset.autofilled;
                }
            }
        }
        hitungKembalian();
    }

    nilaiDiskonInput.addEventListener('input', updateKeranjang);
    window.clearQtyOnFocus = function(inputElement, index) { inputElement.value = ''; };
    window.updateCartItemQty = function(index, newQty) {
        let quantity = parseInt(newQty);
        if (isNaN(quantity) || quantity < 1) quantity = 0;
        if (quantity === 0) keranjang.splice(index, 1);
        else keranjang[index].qty = quantity;
        updateKeranjang();
        updateProdukControls();
    };
    window.removeFromCart = function(index) {
        keranjang.splice(index, 1);
        updateKeranjang();
        updateProdukControls();
    };

    clearCartFab.addEventListener('click', () => {
        keranjang = [];
        resetHargaProdukKeDefault();
        updateKeranjang();
        updateProdukControls();
        namaPemesanInput.value = '';
        alamatPemesanInput.value = '';
        keteranganPesananInput.value = '';
        nominalPembayaranInput.value = 0;
        namaDiskonInput.value = '';
        nilaiDiskonInput.value = 0;
        delete nominalPembayaranInput.dataset.autofilled;
        hitungKembalian();
        updateActionButtonVisibility();
        productSearchBarcodeInput.value = '';
        productSearchBarcodeInput.focus();
    });

    function hitungKembalian() {
        const totalBelanja = parseFloat(keranjangTotal.textContent.replace('Rp', '').replace(/\./g, '').replace(',', '.')) || 0;
        const nominalPembayaran = parseFloat(nominalPembayaranInput.value) || 0;
        const kembalian = nominalPembayaran - totalBelanja;
        kembalianDisplay.textContent = formatRupiah(kembalian);
        kembalianDisplay.style.color = kembalian < 0 ? '#dc3545' : '#ffcc00';
    }
    nominalPembayaranInput.addEventListener('input', hitungKembalian);
    nominalPembayaranInput.addEventListener('focus', () => {
        isNominalInputFocused = true;
        if (nominalPembayaranInput.dataset.autofilled === 'true' || parseFloat(nominalPembayaranInput.value) === 0) {
            nominalPembayaranInput.value = '';
            delete nominalPembayaranInput.dataset.autofilled;
        }
    });
    nominalPembayaranInput.addEventListener('blur', () => {
        isNominalInputFocused = false;
        const totalBelanjaNumeric = parseFloat(keranjangTotal.textContent.replace('Rp', '').replace(/\./g, '').replace(',', '.')) || 0;
        if (nominalPembayaranInput.value === '' && totalBelanjaNumeric > 0) {
            nominalPembayaranInput.value = totalBelanjaNumeric;
            nominalPembayaranInput.dataset.autofilled = 'true';
            hitungKembalian();
        } else if (nominalPembayaranInput.value === '' && totalBelanjaNumeric === 0) {
            nominalPembayaranInput.value = 0;
            delete nominalPembayaranInput.dataset.autofilled;
            hitungKembalian();
        }
    });

    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }

    // == FUNGSI STRUK, CETAK & SHARE ==
    function generateStrukText(paymentMethod) {
        const namaPemesan = namaPemesanInput.value.trim();
        const alamatPemesan = alamatPemesanInput.value.trim();
        const keteranganPesanan = keteranganPesananInput.value.trim();
        const kasirName = localStorage.getItem('namaKasir') || '-';
        const currentUserRole = localStorage.getItem('userRole');
        const totalBelanja = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        let diskonNama = '', diskonNilai = 0;
        if (currentUserRole === 'kasir') {
            diskonNama = namaDiskonInput.value.trim() || '-';
            diskonNilai = parseFloat(nilaiDiskonInput.value) || 0;
        }
        const totalSetelahDiskon = Math.max(totalBelanja - diskonNilai, 0);
        const nominalPembayaran = parseFloat(nominalPembayaranInput.value) || 0;
        const kembalian = nominalPembayaran - totalSetelahDiskon;
        if (keranjang.length === 0) {
            return { success: false, message: 'Keranjang belanja masih kosong!' };
        }
        let message =
`*KEDAI HARINFOOD*\n` +
`Nama: ${namaPemesan || '-'}\n` +
`Alamat: ${alamatPemesan || '-'}\n` +
(currentUserRole === 'kasir' ? `Kasir: ${kasirName}\n` : '') +
`Tanggal: ${new Date().toLocaleDateString('id-ID')}\n` +
`Jam: ${new Date().toLocaleTimeString('id-ID')}\n`;
        if (keteranganPesanan) {
            message += `Catatan: ${keteranganPesanan}\n`;
        }
        message += `----------------------------\n`;
        keranjang.forEach(item => {
            message += `${item.nama} (${item.qty}x): ${formatRupiah(item.harga * item.qty)}\n`;
        });
        if (currentUserRole === 'kasir' && diskonNilai > 0) {
            message += `----------------------------\n`;
            message += `Diskon (${diskonNama}): -${formatRupiah(diskonNilai)}\n`;
        }
        message += `----------------------------\n`;
        message += `TOTAL: ${formatRupiah(totalSetelahDiskon)}\n`;
        message += `Bayar: ${formatRupiah(nominalPembayaran)}\n`;
        message += `Kembalian: ${formatRupiah(kembalian)}\n`;
        message += `----------------------------\nTerima kasih sehat selalu ya 🤲 🙏🥰`;
        return {
            success: true,
            message,
            total: totalSetelahDiskon,
            nominal: nominalPembayaran
        };
    }

    shareOrderFab.addEventListener('click', async () => {
        const shareResult = generateStrukText('Tunai');
        if (!shareResult.success) {
            alert(shareResult.message);
            return;
        }
        const messageToShare = shareResult.message +
            "\n\n[Link Pembayaran QRIS]\nhttps://drive.google.com/file/d/1XAOms4tVa2jkkkCdXRwbNIGy0dvu7RIk/view?usp=drivesdk";
        const totalBelanja = shareResult.total;
        const nominalPembayaran = shareResult.nominal;
        if (totalBelanja === 0) {
            alert('Keranjang belanja kosong. Tidak ada transaksi untuk dibagikan.');
            return;
        }
        if (nominalPembayaran < totalBelanja) {
            alert('Nominal pembayaran kurang dari total belanja. Harap selesaikan pembayaran sebelum membagikan transaksi.');
            return;
        }
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Detail Transaksi HARINFOOD',
                    text: messageToShare
                });
                keranjang = [];
                resetHargaProdukKeDefault();
                updateKeranjang();
                updateProdukControls();
                namaPemesanInput.value = '';
                alamatPemesanInput.value = '';
                keteranganPesananInput.value = '';
                nominalPembayaranInput.value = 0;
                namaDiskonInput.value = '';
                nilaiDiskonInput.value = 0;
                hitungKembalian();
                updateActionButtonVisibility();
                productSearchBarcodeInput.value = '';
                productSearchBarcodeInput.focus();
                return;
            }
        } catch (error) {}
        const encodedMessage = encodeURIComponent(messageToShare);
        const whatsappURL = `https://wa.me/6281235368643?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        keranjang = [];
        resetHargaProdukKeDefault();
        updateKeranjang();
        updateProdukControls();
        namaPemesanInput.value = '';
        alamatPemesanInput.value = '';
        keteranganPesananInput.value = '';
        nominalPembayaranInput.value = 0;
        namaDiskonInput.value = '';
        nilaiDiskonInput.value = 0;
        hitungKembalian();
        updateActionButtonVisibility();
        productSearchBarcodeInput.value = '';
        productSearchBarcodeInput.focus();
    });

    pesanWhatsappPelangganBtn.addEventListener('click', () => {
        if (keranjang.length === 0) {
            alert('Keranjang belanja kosong. Harap tambahkan produk.');
            return;
        }
        const shareResult = generateStrukText('Tunai');
        if (!shareResult.success) {
            alert(shareResult.message);
            return;
        }
        const messageToSend = shareResult.message;
        const encodedMessage = encodeURIComponent(messageToSend);
        const whatsappURL = `https://wa.me/6281235368643?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        keranjang = [];
        resetHargaProdukKeDefault();
        updateKeranjang();
        updateProdukControls();
        namaPemesanInput.value = '';
        alamatPemesanInput.value = '';
        keteranganPesananInput.value = '';
        nominalPembayaranInput.value = 0;
        namaDiskonInput.value = '';
        nilaiDiskonInput.value = 0;
        hitungKembalian();
        updateActionButtonVisibility();
        productSearchBarcodeInput.value = '';
        productSearchBarcodeInput.focus();
    });

    btnBayarQris.addEventListener('click', () => {
        window.open('https://drive.google.com/file/d/1XAOms4tVa2jkkkCdXRwbNIGy0dvu7RIk/view?usp=drivesdk', '_blank');
    });

    function printStruk(paymentMethod) {
        const shareResult = generateStrukText(paymentMethod);
        if (!shareResult.success) {
            alert(shareResult.message);
            return false;
        }
        const defaultFooterText = "Terima kasih sehat selalu ya 🤲 🙏🥰";
        const qrisImagePath = "qris.webp";
        let isiTanpaHeader = shareResult.message.replace(/^\*KEDAI HARINFOOD\*\n/, '');
        isiTanpaHeader = isiTanpaHeader.replace(/----------------------------\nTerima kasih sehat selalu ya [^\n]+$/g, '');
        let printContent = `
            <html>
            <head>
                <title>Struk Belanja</title>
                <meta name="viewport" content="width=58mm, initial-scale=1">
                <link rel="stylesheet" href="style.css">
                <style>
                    @media print {
                        .print-actions { display: none !important; }
                    }
                    .print-actions {
                        text-align: center;
                        margin-top: 10px;
                        margin-bottom: 10px;
                    }
                    .print-actions button {
                        padding: 10px 16px;
                        font-size: 1.1em;
                        border-radius: 8px;
                        margin: 0 4px;
                        background: #00b0ff;
                        color: #fff;
                        border: none;
                        cursor: pointer;
                    }
                    .print-actions button:active {
                        background: #0072a3;
                    }
                    .print-header {
                        text-align: center !important;
                        margin-bottom: 10px;
                    }
                    .print-header p {
                        margin: 0;
                    }
                </style>
                <script>
                    function shareWhatsApp() {
                        var msg = encodeURIComponent(\`${shareResult.message}\`);
                        window.open('https://wa.me/?text=' + msg, '_blank');
                    }
                    function cetakUlang() {
                        window.print();
                    }
                <\/script>
            </head>
            <body>
                <div id="print-area">
                    <div class="print-header">
                        <p class="shop-name-print"><b>HARINFOOD</b></p>
                        <p class="shop-address-print">Jl Ender Rakit - Gedongan</p>
                        <p class="shop-phone-print">081235368643</p>
                    </div>
                    <pre style="font-family:inherit;font-size:inherit;white-space:pre-wrap;">${isiTanpaHeader}</pre>
        `;
        if (paymentMethod === 'QRIS') {
            printContent += `
                <div style="text-align: center; margin-top: 10px; margin-bottom: 5px;">
                    <img src="${qrisImagePath}" alt="QRIS Code" style="width: 45mm; height: auto; display: block; margin: 0 auto; padding-bottom: 5px;">
                </div>
                <p class="thank-you">${defaultFooterText} - Scan QRIS Untuk Pembayaran</p>
            `;
        } else {
            printContent += `<p class="thank-you">${defaultFooterText}</p>`;
        }
        printContent += `
            <div class="print-actions">
                <button onclick="cetakUlang()">Cetak Struk</button>
                <button onclick="shareWhatsApp()">Bagikan via WhatsApp</button>
            </div>
        `;
        printContent += `</div></body></html>`;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            keranjang = [];
            resetHargaProdukKeDefault();
            updateKeranjang();
            updateProdukControls();
            namaPemesanInput.value = '';
            alamatPemesanInput.value = '';
            keteranganPesananInput.value = '';
            nominalPembayaranInput.value = 0;
            namaDiskonInput.value = '';
            nilaiDiskonInput.value = 0;
            hitungKembalian();
            paymentChoiceButtons.style.display = 'flex';
            updateActionButtonVisibility();
            productSearchBarcodeInput.value = '';
            productSearchBarcodeInput.focus();
        }, 300);
        return true;
    }

    if (printFab) {
        printFab.addEventListener('click', () => {
            if (keranjang.length === 0) {
                alert('Keranjang belanja kosong. Tidak ada yang bisa dicetak.');
                return;
            }
            printOptionsPopup.style.display = 'flex';
        });
    }
    cetakStrukButton.addEventListener('click', () => {
        if (keranjang.length === 0) {
            alert('Keranjang belanja kosong. Tidak ada yang bisa dicetak.');
            return;
        }
        printOptionsPopup.style.display = 'flex';
    });
    btnPrintTunai.addEventListener('click', () => {
        printOptionsPopup.style.display = 'none';
        printStruk('Tunai');
    });
    btnPrintQris.addEventListener('click', () => {
        printOptionsPopup.style.display = 'none';
        printStruk('QRIS');
    });
    closePrintPopupBtn.addEventListener('click', () => {
        printOptionsPopup.style.display = 'none';
    });

    // === Modal manual order dengan ENTER "Tab" ke field selanjutnya ===
    addManualOrderFab.addEventListener('click', () => {
        manualOrderModal.style.display = 'flex';
        manualProductNameInput.value = '';
        manualProductPriceInput.value = '';
        manualProductQtyInput.value = '1';
        manualProductNameInput.focus();
    });
    manualProductNameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            manualProductPriceInput.focus();
        }
    });
    manualProductPriceInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            manualProductQtyInput.focus();
        }
    });
    manualProductQtyInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            window.addManualOrderItem();
        }
    });
    window.closeManualOrderModal = function() {
        manualOrderModal.style.display = 'none';
        productSearchBarcodeInput.focus(); 
    };
    window.addManualOrderItem = function() {
        const name = manualProductNameInput.value.trim();
        const price = parseFloat(manualProductPriceInput.value);
        const qty = parseInt(manualProductQtyInput.value);
        if (!name || isNaN(price) || price < 0 || isNaN(qty) || qty < 1) {
            alert('Harap isi nama produk, harga (minimal 0), dan kuantitas (minimal 1) dengan benar.');
            return;
        }
        const newManualItem = {
            id: nextManualItemId++, 
            nama: name,
            harga: price,
            qty: qty,
            isManual: true 
        };
        tambahKeKeranjang(newManualItem);
        manualOrderModal.style.display = 'none';
        productSearchBarcodeInput.focus(); 
    };

    productSearchBarcodeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault(); 
            const query = productSearchBarcodeInput.value.trim();
            if (query) {
                const foundProduct = produkData.find(p => 
                    p.barcode === query || p.nama.toLowerCase().includes(query.toLowerCase())
                );
                if (foundProduct) {
                    tambahKeKeranjang(foundProduct);
                    searchBarcodeFeedback.textContent = `Produk "${foundProduct.nama}" ditambahkan!`;
                    searchBarcodeFeedback.style.color = '#28a745';
                    productSearchBarcodeInput.value = ''; 
                } else {
                    searchBarcodeFeedback.textContent = `Produk atau barcode "${query}" tidak ditemukan.`;
                    searchBarcodeFeedback.style.color = '#dc3545';
                }
            } else {
                searchBarcodeFeedback.textContent = 'Masukkan nama produk atau scan barcode.';
                searchBarcodeFeedback.style.color = '#e0e0e0';
            }
            productSearchBarcodeInput.focus();
        }
    });
    productSearchBarcodeInput.addEventListener('input', () => {
        searchBarcodeFeedback.textContent = '';
    });

    function updateActionButtonVisibility() {
        const currentUserRole = localStorage.getItem('userRole');
        if (currentUserRole === 'pelanggan') {
            pesanWhatsappPelangganBtn.style.display = 'flex';
            cetakStrukButton.style.display = 'none';
            if (printFab) printFab.style.display = 'none';
        } else {
            pesanWhatsappPelangganBtn.style.display = 'none';
            cetakStrukButton.style.display = 'none';
            if (printFab) printFab.style.display = 'flex';
        }
    }

    // === SHORTCUT KEYBOARD KASIR (F1, F2, F3, F4, F6) ===
    // F1: Cetak Struk, F2: Share, F3: Tambah Pesanan Manual, F4: Hapus Keranjang, F6: Tampilkan Popup Keranjang
    document.addEventListener('keydown', function(e) {
        const currentUserRole = localStorage.getItem('userRole');
        const manualOrderOpen = manualOrderModal && manualOrderModal.style.display === 'flex';
        if (currentUserRole !== 'kasir' || manualOrderOpen) return;

        // F1 -> Cetak Struk
        if (e.key === 'F1') {
            e.preventDefault();
            if (keranjang.length > 0 && printFab) {
                printFab.click();
            }
        }

        // F2 -> Share WhatsApp
        if (e.key === 'F2') {
            e.preventDefault();
            if (keranjang.length > 0 && shareOrderFab) {
                shareOrderFab.click();
            }
        }

        // F3 -> Tambah Pesanan Manual
        if (e.key === 'F3') {
            e.preventDefault();
            if (addManualOrderFab) addManualOrderFab.click();
        }

        // F4 -> Hapus Keranjang
        if (e.key === 'F4') {
            e.preventDefault();
            if (clearCartFab) clearCartFab.click();
        }

        // F6 -> Popup Keranjang Baru
        if (e.key === 'F6') {
            e.preventDefault();
            showPopupKeranjang();
        }
    });

    // ==== Popup Keranjang F6 ====
    function showPopupKeranjang() {
        updatePopupKeranjang();
        popupKeranjang.style.display = "flex";
        // Fokuskan tombol close untuk aksesibilitas
        setTimeout(() => {
            document.getElementById('close-popup-keranjang').focus();
        }, 100);
    }
    function hidePopupKeranjang() {
        popupKeranjang.style.display = "none";
    }
    document.getElementById('close-popup-keranjang').onclick = hidePopupKeranjang;

    // Fungsi update isi popup keranjang
    function updatePopupKeranjang() {
        // Jika popup tidak sedang tampil, tidak perlu update (kecuali saat show)
        if (popupKeranjang.style.display === "none") return;
        const tbody = document.getElementById('popup-keranjang-items');
        const totalSpan = document.getElementById('popup-keranjang-total');
        tbody.innerHTML = '';
        let total = 0;
        if (keranjang.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#888;">Keranjang kosong.</td></tr>`;
        } else {
            keranjang.forEach((item, idx) => {
                const subtotal = item.harga * item.qty;
                total += subtotal;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.nama}</td>
                    <td>
                        <input type="number" value="${item.qty}" min="1" style="width:48px"
                            onchange="window.popupUpdateQty(${idx}, this.value)">
                    </td>
                    <td>${formatRupiah(subtotal)}</td>
                    <td>
                        <button onclick="window.popupRemoveItem(${idx})" style="background:none;border:none;color:#dc3545;font-size:1.2em;cursor:pointer;" title="Hapus"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
        totalSpan.textContent = formatRupiah(total);
    }
    // Expose popup keranjang actions as global for inline handler
    window.popupUpdateQty = function(idx, val) {
        let quantity = parseInt(val);
        if (isNaN(quantity) || quantity < 1) quantity = 0;
        if (quantity === 0) keranjang.splice(idx, 1);
        else keranjang[idx].qty = quantity;
        updateKeranjang();
        updatePopupKeranjang();
    };
    window.popupRemoveItem = function(idx) {
        keranjang.splice(idx, 1);
        updateKeranjang();
        updatePopupKeranjang();
    };
    // Tombol cetak struk di popup keranjang
    document.getElementById('popup-keranjang-print').onclick = function() {
        hidePopupKeranjang();
        printStruk('Tunai');
    };

    // Klik luar popup untuk menutup popup keranjang
    popupKeranjang.addEventListener('click', function(e) {
        // Tutup jika klik di luar content
        if (e.target === popupKeranjang) {
            hidePopupKeranjang();
        }
    });

    // Style popup keranjang agar tampil modern (bisa juga diletakkan di file CSS)
    const popupKeranjangStyle = document.createElement('style');
    popupKeranjangStyle.innerHTML = `
    #popup-keranjang {
        display:none;
        position:fixed;z-index:99999;left:0;top:0;width:100vw;height:100vh;
        background:rgba(0,0,0,0.25);
        justify-content:center;align-items:center;
    }
    #popup-keranjang .popup-keranjang-content {
        background:#fff;
        min-width:320px;
        max-width:98vw;
        padding:24px 20px 18px 20px;
        border-radius:12px;
        box-shadow:0 6px 36px #0002;
        position:relative;
        font-size:1em;
    }
    #popup-keranjang .popup-keranjang-table th,#popup-keranjang .popup-keranjang-table td {
        padding:4px 7px;
        border-bottom:1px solid #eee;
        font-size:1em;
        text-align:left;
    }
    #popup-keranjang .popup-keranjang-table th {background:#f6f6f6;}
    #popup-keranjang .popup-keranjang-table input[type=number]::-webkit-inner-spin-button,
    #popup-keranjang .popup-keranjang-table input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    `;
    document.head.appendChild(popupKeranjangStyle);

    // === END: Popup Keranjang F6 ===

    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
        loginPopup.style.display = 'none';
        appContainer.style.display = 'block';
        if (storedRole === 'kasir') {
            kasirFabs.style.display = 'block';
            cetakStrukButton.style.display = 'none';
            pesanInfoLabel.style.display = 'none';
            shareOrderFab.style.display = 'flex';
            productSearchBarcodeInput.style.display = 'block';
            productSearchBarcodeInput.focus();
            if (printFab) printFab.style.display = 'flex';
        } else {
            kasirFabs.style.display = 'none';
            cetakStrukButton.style.display = 'none';
            pesanInfoLabel.style.display = 'block';
            pesanInfoLabel.textContent = "Terima kasih pelanggan setia, sehat selalu ya 🙏 tanpa anda tidak ada cerita di kedai kita. Selalu kunjungi kami ya";
            shareOrderFab.style.display = 'none';
            productSearchBarcodeInput.style.display = 'none';
            if (printFab) printFab.style.display = 'none';
        }
        initializeApp();
    } else {
        loginPopup.style.display = 'flex';
        appContainer.style.display = 'none';
        if (printFab) printFab.style.display = 'none';
    }
});