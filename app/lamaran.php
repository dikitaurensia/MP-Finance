<?php
$msg = "";
$jenisLamaran = ["Kurir", "Supir", "Kernet", "Staff Gudang", "Admin Finance", "Admin Accounting", "Admin Marketing", "Admin Gudang", "Supervisor", "Manager"];


$db = mysqli_connect("185.224.137.214", "u104359481_admin", "A1b2c3d4!", "u104359481_tracking");

$idlamaran = round(microtime(true));
if (isset($_POST['upload'])) {
    $tgllamaran = date("Y-m-d");
    $posisilamaran = mysqli_real_escape_string($db, $_POST['posisilamaran']);
    $namadepan = mysqli_real_escape_string($db, $_POST['namadepan']);
    $namabelakang = mysqli_real_escape_string($db, $_POST['namabelakang']);
    $tempatlahir = mysqli_real_escape_string($db, $_POST['tempatlahir']);
    $tgllahir = mysqli_real_escape_string($db, $_POST['tgllahir']);
    $notelp = mysqli_real_escape_string($db, $_POST['notelp']);
    $alamatktp = mysqli_real_escape_string($db, $_POST['alamatktp']);
    $keluarahanktp = mysqli_real_escape_string($db, $_POST['keluarahanktp']);
    $kecamatanktp = mysqli_real_escape_string($db, $_POST['kecamatanktp']);
    $kotaktp = mysqli_real_escape_string($db, $_POST['kotaktp']);
    $alamatdomisili = mysqli_real_escape_string($db, $_POST['alamatdomisili']);
    $kelurahandomisili = mysqli_real_escape_string($db, $_POST['kelurahandomisili']);
    $kecamatandomisili = mysqli_real_escape_string($db, $_POST['kecamatandomisili']);
    $kotadomisili = mysqli_real_escape_string($db, $_POST['kotadomisili']);
    $agama = mysqli_real_escape_string($db, $_POST['agama']);
    $ktp = mysqli_real_escape_string($db, $_POST['ktp']);

    $sima = "";
    $simaberlaku = "";
    if (isset($_POST["sima"])) {
        $sima = mysqli_real_escape_string($db, $_POST['sima']);
        $simaberlaku = mysqli_real_escape_string($db, $_POST['simaberlaku']);
    }

    $simb = "";
    $simbberlaku = "";
    if (isset($_POST["simb"])) {
        $sima = mysqli_real_escape_string($db, $_POST['simb']);
        $simbberlaku = mysqli_real_escape_string($db, $_POST['simbberlaku']);
    }

    $simc = "";
    $simcberlaku = "";
    if (isset($_POST["simc"])) {
        $sima = mysqli_real_escape_string($db, $_POST['simc']);
        $simcberlaku = mysqli_real_escape_string($db, $_POST['simcberlaku']);
    }

    $simlain = "";
    $simlainberlaku =   "";
    if (isset($_POST["simlain"])) {
        $simlain = mysqli_real_escape_string($db, $_POST['simlain']);
        $simlainberlaku = mysqli_real_escape_string($db, $_POST['simlainberlaku']);
    }

    $npwm = mysqli_real_escape_string($db, $_POST['npwm']);
    $statuspernikahan = mysqli_real_escape_string($db, $_POST['statuspernikahan']);
    $namapasangan = mysqli_real_escape_string($db, $_POST['namapasangan']);
    $jmlanak = mysqli_real_escape_string($db, $_POST['jmlanak']);
    $namadarurat = mysqli_real_escape_string($db, $_POST['namadarurat']);
    $statusdarurat = mysqli_real_escape_string($db, $_POST['statusdarurat']);
    $notelpdarurat = mysqli_real_escape_string($db, $_POST['notelpdarurat']);
    $ayah = mysqli_real_escape_string($db, $_POST['ayah']);
    $ibu = mysqli_real_escape_string($db, $_POST['ibu']);
    $saudara1 = mysqli_real_escape_string($db, $_POST['saudara1']);
    $saudara2 = mysqli_real_escape_string($db, $_POST['saudara2']);
    $saudara3 = mysqli_real_escape_string($db, $_POST['saudara3']);
    $pendidikanterakhir = mysqli_real_escape_string($db, $_POST['pendidikanterakhir']);
    $tempatpendidikan = mysqli_real_escape_string($db, $_POST['tempatpendidikan']);
    $nilaipendidikan = mysqli_real_escape_string($db, $_POST['nilaipendidikan']);
    $inggrisbaca = mysqli_real_escape_string($db, $_POST['inggrisbaca']);
    $inggrisbicara = mysqli_real_escape_string($db, $_POST['inggrisbicara']);
    $mandarinbaca = mysqli_real_escape_string($db, $_POST['mandarinbaca']);
    $mandarinbicara = mysqli_real_escape_string($db, $_POST['mandarinbicara']);
    $jenispekerjaanterakhir = mysqli_real_escape_string($db, $_POST['jenispekerjaanterakhir']);
    $jobdeskterakhir = mysqli_real_escape_string($db, $_POST['jobdeskterakhir']);
    $temanbekerja = mysqli_real_escape_string($db, $_POST['temanbekerja']);
    $pernahlamar = mysqli_real_escape_string($db, $_POST['pernahlamar']);
    $parttime = mysqli_real_escape_string($db, $_POST['parttime']);
    $referensikerja = mysqli_real_escape_string($db, $_POST['referensikerja']);
    $citacita = mysqli_real_escape_string($db, $_POST['citacita']);
    $minimalgaji = mysqli_real_escape_string($db, $_POST['minimalgaji']);
    $tdkpunyasim = mysqli_real_escape_string($db, $_POST['tdkpunyasim']);
    $kontribusi = mysqli_real_escape_string($db, $_POST['kontribusi']);


    $fotoselfi = "";
    $suratlamaran = "";
    $fotoktp = "";
    $fotosim = "";
    $ijazah = "";
    $skck = "";
    $kartukeluarga = "";
    $sertifikat = "";
    $keterangankerja = "";

    if ($_FILES["fotoselfi"]["error"] == 0) {
        $fotoselfi = $_FILES['fotoselfi']['name'];
        $fotoselfi = "images/" . $idlamaran . "_fotoselfi" . basename($fotoselfi);
        move_uploaded_file($_FILES['fotoselfi']['tmp_name'], $fotoselfi);
    }

    if ($_FILES["suratlamaran"]["error"] == 0) {
        $suratlamaran = $_FILES['suratlamaran']['name'];
        $suratlamaran = "images/" . $idlamaran . "_suratlamaran" . basename($suratlamaran);
        move_uploaded_file($_FILES['suratlamaran']['tmp_name'], $suratlamaran);
    }

    if ($_FILES["fotoktp"]["error"] == 0) {
        $fotoktp = $_FILES['fotoktp']['name'];
        $fotoktp = "images/" . $idlamaran . "_fotoktp" . basename($fotoktp);
        move_uploaded_file($_FILES['fotoktp']['tmp_name'], $fotoktp);
    }

    if ($_FILES["fotosim"]["error"] == 0) {
        $fotosim = $_FILES['fotosim']['name'];
        $fotosim = "images/" . $idlamaran . "_fotosim" . basename($fotosim);
        move_uploaded_file($_FILES['fotosim']['tmp_name'], $fotosim);
    }

    if ($_FILES["ijazah"]["error"] == 0) {
        $ijazah = $_FILES['ijazah']['name'];
        $ijazah = "images/" . $idlamaran . "_ijazah" . basename($ijazah);
        move_uploaded_file($_FILES['ijazah']['tmp_name'], $ijazah);
    }

    if ($_FILES["skck"]["error"] == 0) {
        $skck = $_FILES['skck']['name'];
        $skck = "images/" . $idlamaran . "_skck" . basename($skck);
        move_uploaded_file($_FILES['skck']['tmp_name'], $skck);
    }

    if ($_FILES["kartukeluarga"]["error"] == 0) {
        $kartukeluarga = $_FILES['kartukeluarga']['name'];
        $kartukeluarga = "images/" . $idlamaran . "_kartukeluarga" . basename($kartukeluarga);
        move_uploaded_file($_FILES['kartukeluarga']['tmp_name'], $kartukeluarga);
    }

    if ($_FILES["sertifikat"]["error"] == 0) {
        $sertifikat = $_FILES['sertifikat']['name'];
        $sertifikat = "images/" . $idlamaran . "_sertifikat" . basename($sertifikat);
        move_uploaded_file($_FILES['sertifikat']['tmp_name'], $sertifikat);
    }

    if ($_FILES["keterangankerja"]["error"] == 0) {
        $keterangankerja = $_FILES['keterangankerja']['name'];
        $keterangankerja = "images/" . $idlamaran . "_keterangankerja" . basename($keterangankerja);
        move_uploaded_file($_FILES['keterangankerja']['tmp_name'], $keterangankerja);
    }

    //tandatangan
    $folderPath = "images/";
    $image_parts = explode(";base64,", $_POST['signed']);
    $image_type_aux = explode("image/", $image_parts[0]);

    $image_type = $image_type_aux[1];

    $image_base64 = base64_decode($image_parts[1]);

    $tandatangan = $folderPath . $idlamaran . '.' . $image_type;

    file_put_contents($tandatangan, $image_base64);


    $sql = "insert into `lamaran` (`idlamaran`, `tgllamaran`, `posisilamaran`, `fotoselfi`, `namadepan`, `namabelakang`, `tempatlahir`, `tgllahir`, `notelp`, 
  `alamatktp`, `keluarahanktp`, `kecamatanktp`, `kotaktp`, `alamatdomisili`, `kelurahandomisili`, `kecamatandomisili`, `kotadomisili`, `agama`, `ktp`, `sima`, 
  `simaberlaku`, `simb`, `simbberlaku`, `simc`, `simcberlaku`, `simlain`, `simlainberlaku`, `npwm`, `statuspernikahan`, `namapasangan`, `jmlanak`, `namadarurat`, 
  `statusdarurat`, `notelpdarurat`, `ayah`, `ibu`, `saudara1`, `saudara2`, `saudara3`, `pendidikanterakhir`, `tempatpendidikan`, `nilaipendidikan`, `inggrisbaca`, 
  `inggrisbicara`, `mandarinbaca`, `mandarinbicara`, `jenispekerjaanterakhir`, `jobdeskterakhir`, `temanbekerja`, `pernahlamar`, `parttime`, `referensikerja`, 
  `citacita`, `minimalgaji`, `suratlamaran`, `fotoktp`, `fotosim`, `ijazah`, `skck`, `kartukeluarga`,`sertifikat`,`keterangankerja`, `tdkpunyasim`,`tandatangan`,`kontribusi`) values(
    '$idlamaran', 
    '$tgllamaran', 
    '$posisilamaran', 
    '$fotoselfi', 
    '$namadepan', 
    '$namabelakang', 
    '$tempatlahir', 
    '$tgllahir', 
    '$notelp', 
    '$alamatktp', 
    '$keluarahanktp', 
    '$kecamatanktp', 
    '$kotaktp', 
    '$alamatdomisili', 
    '$kelurahandomisili', 
    '$kecamatandomisili', 
    '$kotadomisili', 
    '$agama', 
    '$ktp', 
    '$sima', 
    '$simaberlaku', 
    '$simb', 
    '$simbberlaku', 
    '$simc', 
    '$simcberlaku', 
    '$simlain', 
    '$simlainberlaku', 
    '$npwm', 
    '$statuspernikahan', 
    '$namapasangan', 
    '$jmlanak', 
    '$namadarurat', 
    '$statusdarurat', 
    '$notelpdarurat', 
    '$ayah', 
    '$ibu', 
    '$saudara1', 
    '$saudara2', 
    '$saudara3', 
    '$pendidikanterakhir', 
    '$tempatpendidikan', 
    '$nilaipendidikan', 
    '$inggrisbaca', 
    '$inggrisbicara', 
    '$mandarinbaca', 
    '$mandarinbicara', 
    '$jenispekerjaanterakhir', 
    '$jobdeskterakhir', 
    '$temanbekerja', 
    '$pernahlamar', 
    '$parttime', 
    '$referensikerja', 
    '$citacita', 
    '$minimalgaji', 
    '$suratlamaran', 
    '$fotoktp', 
    '$fotosim', 
    '$ijazah', 
    '$skck',
    '$kartukeluarga',
    '$sertifikat',
    '$keterangankerja',
    '$tdkpunyasim',
    '$tandatangan',
    '$kontribusi'
);";

    mysqli_query($db, $sql);


    //pengalaman kerja
    $userData = count($_POST["namaperusahaan"]);

    if ($userData > 0) {
        for ($i = 0; $i < $userData; $i++) {
            $namaperusahaan =  mysqli_real_escape_string($db, $_POST["namaperusahaan"][$i]);
            $alamatperusahaan =  mysqli_real_escape_string($db, $_POST["alamatperusahaan"][$i]);
            $periodekerja = mysqli_real_escape_string($db, $_POST["periodekerja"][$i]);
            $notelpperusahaan = mysqli_real_escape_string($db, $_POST["notelpperusahaan"][$i]);
            $jabatanawal = mysqli_real_escape_string($db, $_POST["jabatanawal"][$i]);
            $jabatanakhir = mysqli_real_escape_string($db, $_POST["jabatanakhir"][$i]);
            $namaatasan = mysqli_real_escape_string($db, $_POST["namaatasan"][$i]);
            $alasanberhenti = mysqli_real_escape_string($db, $_POST["alasanberhenti"][$i]);
            $gajiterakhir = mysqli_real_escape_string($db, $_POST["gajiterakhir"][$i]);

            if (trim($namaperusahaan != '') && trim($alasanberhenti != '')) {
                $query  = "INSERT INTO lamaran_pengalaman (idlamaran,namaperusahaan,periodekerja,alamatperusahaan,notelp,jabatanawal,jabatanakhir,namaatasan,alasanberhenti,gajiterakhir) 
                VALUES ('$idlamaran','$namaperusahaan','$periodekerja','$alamatperusahaan','$notelpperusahaan','$jabatanawal','$jabatanakhir','$namaatasan','$alasanberhenti','$gajiterakhir')";
                mysqli_query($db, $query);
            }
        }
    }

    $msg = "sukses";
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" href="styles.css" type="text/css">
    <link rel="stylesheet" href="./font-awesome/css/font-awesome.min.css">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/screw-filereader@1.4.3/index.min.js"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <title>Mitran Pack | Job Application Form</title>

    <!-- <link rel="stylesheet" href="js-lib/jquery.signature.css" /> -->
    <!-- <link rel="stylesheet" href="js-lib/jquery-ui.css" />
    <link rel="stylesheet" href="js-lib/jquery.signature.css" />

    <script src="js-lib/jquery.min.js" type="text/javascript"></script>
    <script src="js-lib/jquery-ui.min.js" type="text/javascript"> </script>
    <script src="js-lib/jquery.signature.js" type="text/javascript"></script>
    <script src="js-lib/jquery.ui.touch-punch.min.js" type="text/javascript"></script> -->

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <link type="text/css" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/south-street/jquery-ui.css" rel="stylesheet">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script type="text/javascript" src="asset/jquery.signature.min.js"></script>
    <link rel="stylesheet" type="text/css" href="asset/jquery.signature.css">
    <script src="asset/jquery.ui.touch-punch.min.js" type="text/javascript"></script>

    <!--[if IE]>
        <script type="text/javascript" src="js-lib/excanvas.js"></script>
    <![endif]-->

    <style>
        .kbw-signature {
            height: 200px;
            width: 300px;
        }

        #sig canvas {
            width: 100% !important;
            height: auto;
        }
    </style>

    <script>
        $(function() {
            $('#sig').signature({
                guideline: true
            });

            $('#hapus').click(function() {
                $('#sig').signature('clear');
                $('#salinan').signature('clear');
            });

            $('#json').click(function() {
                var pesan = $('#sig').signature('toJSON');
                alert(pesan);
            });

            $('#draw').click(function() {
                var json = $('#sig').signature('toJSON');
                $('#salinan').signature('draw', json);
            });

            $('#salinan').signature({
                disabled: true,
                guideline: true
            });

        });
    </script>

</head>

<body>
    <?php
    if ($msg == "sukses") {
        echo "<script>";
        echo 'swal({title: "Terima kasih atas data Anda.",text: "Kami berharap Anda bisa menjadi bagian tim hebat Mitran Pack",icon: "success",button: "Ok",});';
        echo "</script>";
    }
    ?>

    <div class="App">
        <div id="form-content">
            <div class="form-title">
                <h1>Job Application Form</h1>
            </div>
            <div class="form-app">
                <form method="POST" action="lamaran.php" enctype="multipart/form-data" id="formlamaran">
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">1.</span>
                            <label>Foto Terbaru/ Foto Selfie (harus jelas) <span class="red">*</span></label>
                        </div>
                        <div class="field-input">
                            <div class="input-3">
                                <img id="fotoPreview" class="image-upload" src="./ic_image.png" />
                                <input id="uploadFoto" class="no-outline upload-file" type="file" name="fotoselfi" accept="image/*" onchange="change('fotoPreview','uploadFoto');" required />
                                <label for="uploadFoto" class="label-upload-foto btn-add-experience">Pilih Foto</label>
                            </div>
                        </div>
                    </div>
                    <div class="note"><i>Pastikan kolom yang diberi tanda bintang (<span class="red">*</span>) diisi.</i></div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">2.</span>
                            <label>Nama Lengkap <span class="red">*</span></label>
                        </div>
                        <div class="field-input grid gap-20 layout-template-1">
                            <div class="input-1">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Nama Depan" class="no-outline" name="namadepan" required />
                            </div>
                            <div class="input-1">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Nama Belakang" class="no-outline" name="namabelakang" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">3.</span>
                            <label>Posisi Lamaran <span class="red">*</span></label>
                        </div>
                        <div class="field-input flex gap-20">
                            <div class="input-1 full-width">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Posisi Lamaran" type="text" list="optionlamaran" id="posisilamaran" name="posisilamaran" class="full-width parentbg" style="font-size:16px;" required />
                            </div>
                        </div>
                        <datalist id="optionlamaran">
                            <?php foreach ($jenisLamaran as $key => $value) { ?>
                                <option><?php echo $value; ?></option>
                            <?php } ?>
                        </datalist>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">4.</span>
                            <label>Tanggal Lahir <span class="red">*</span></label>
                        </div>
                        <div class="field-input flex gap-20">
                            <div class="input-1 full-width">
                                <i class="fa fa-calendar-o ic-field" aria-hidden="true"></i>
                                <input placeholder="Tanggal Lahir" class="no-outline" name="tgllahir" type="date" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">5.</span>
                            <label>Tempat Lahir <span class="red">*</span></label>
                        </div>
                        <div class="field-input flex gap-20">
                            <div class="input-1 full-width">
                                <i class="fa fa-map-marker ic-field" aria-hidden="true"></i>
                                <input placeholder="Tempat Lahir" class="no-outline" name="tempatlahir" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">6.</span>
                            <label>Nomor WA/Kontak yang dapat dihubungi <span class="red">*</span></label>
                        </div>
                        <div class="field-input flex gap-20">
                            <div class="input-1 full-width">
                                <i class="fa fa-phone ic-field" aria-hidden="true"></i>
                                <input placeholder="Nomor yang dapat dihubungi" class="no-outline" name="notelp" type="number" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">7.</span>
                            <label>Alamat sesuai KTP <span class="red">*</span></label>
                        </div>
                        <div class="field-input flex gap-20">
                            <div class="input-1 full-width">
                                <i class="fa fa-map-marker ic-field" aria-hidden="true"></i>
                                <input placeholder="Nama Jalan, RT/RW dan Nomor Rumah" class="no-outline" name="alamatktp" required />
                            </div>
                        </div>
                        <div class="child-field grid layout-template-3 gap-5">
                            <div class="field-input flex gap-20">
                                <div class="input-1 full-width-mobile">
                                    <i class="fa fa-map-marker ic-field" aria-hidden="true"></i>
                                    <input placeholder="Kelurahan" class="no-outline" name="keluarahanktp" required />
                                </div>
                            </div>
                            <div class="field-input flex gap-20">
                                <div class="input-1 full-width-mobile">
                                    <i class="fa fa-map-marker ic-field" aria-hidden="true"></i>
                                    <input placeholder="Kecamatan" class="no-outline" name="kecamatanktp" required />
                                </div>
                            </div>
                            <div class="field-input flex gap-20">
                                <div class="input-1 full-width-mobile">
                                    <i class="fa fa-map-marker ic-field" aria-hidden="true"></i>
                                    <input placeholder="Kota" class="no-outline" name="kotaktp" required />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">8.</span>
                            <label>Alamat Tinggal Sekarang (abaikan jika sama dengan Alamat KTP no.7)</label>
                        </div>
                        <div class="field-input flex gap-20">
                            <div class="input-1 full-width">
                                <i class="fa fa-map-marker ic-field" aria-hidden="true"></i>
                                <input placeholder="Nama Jalan dan Nomor Rumah" class="no-outline" name="alamatdomisili" />
                            </div>
                        </div>
                        <div class="child-field grid layout-template-3 gap-5">
                            <div class="field-input flex gap-20">
                                <div class="input-1 full-width-mobile">
                                    <i class="fa fa-map-marker ic-field" aria-hidden="true"></i>
                                    <input placeholder="Kelurahan" class="no-outline" name="kelurahandomisili" />
                                </div>
                            </div>
                            <div class="field-input flex gap-20">
                                <div class="input-1 full-width-mobile">
                                    <i class="fa fa-map-marker ic-field" aria-hidden="true"></i>
                                    <input placeholder="Kecamatan" class="no-outline" name="kecamatandomisili" />
                                </div>
                            </div>
                            <div class="field-input flex gap-20">
                                <div class="input-1 full-width-mobile">
                                    <i class="fa fa-map-marker ic-field" aria-hidden="true"></i>
                                    <input placeholder="Kota" class="no-outline" name="kotadomisili" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">9.</span>
                            <label>Agama <span class="red">*</span></label>
                        </div>
                        <div class="field-input flex gap-20">
                            <div class="input-1 full-width">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Agama" type="text" list="optionagama" id="agama" name="agama" class="full-width parentbg" style="font-size:16px;" required />
                            </div>
                        </div>
                        <datalist id="optionagama">
                            <option>Islam</option>
                            <option>Kristen Protestan</option>
                            <option>Katolik</option>
                            <option>Buddha</option>
                            <option>Hindu</option>
                        </datalist>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">10.</span>
                            <label>No. KTP <span class="red">*</span></label>
                        </div>
                        <div class="field-input flex gap-20">
                            <div class="input-1 full-width">
                                <i class="fa fa-id-card-o ic-field" aria-hidden="true"></i>
                                <input placeholder="Nomor KTP yang berlaku" class="no-outline" name="ktp" type="number" minlength="16" maxlength="16" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">11.</span>
                            <label>SIM yang dimiliki <span class="red">*</span></label>
                        </div>
                        <div class="field-input">
                            <div class="input-2 mt-5 input-sim">
                                <div>
                                    <input class="no-outline" type="checkbox" name="sima" value="SIM A" />
                                    <label>SIM A</label>
                                </div>
                                <div>Berlaku:</div>
                                <div class="input-date-sim ml-2">
                                    <i class="fa fa-calendar-o ic-field" aria-hidden="true"></i>
                                    <input class="no-outline" name="simaberlaku" type="date" style="font-size:14px;" />
                                </div>
                            </div>
                            <div class="input-2 mt-5 input-sim">
                                <div>
                                    <input class="no-outline" type="checkbox" name="simb" value="SIM B" />
                                    <label>SIM B</label>
                                </div>
                                <div>Berlaku:</div>
                                <div class="input-date-sim ml-2">
                                    <i class="fa fa-calendar-o ic-field" aria-hidden="true"></i>
                                    <input class="no-outline" name="simbberlaku" type="date" style="font-size:14px;" />
                                </div>
                            </div>
                            <div class="input-2 mt-5 input-sim">
                                <div>
                                    <input class="no-outline" type="checkbox" name="simc" value="SIM C" />
                                    <label>SIM C</label>
                                </div>
                                <div>Berlaku:</div>
                                <div class="input-date-sim ml-2">
                                    <i class="fa fa-calendar-o ic-field" aria-hidden="true"></i>
                                    <input class="no-outline" name="simcberlaku" type="date" style="font-size:14px;" />
                                </div>
                            </div>
                            <div class="input-2 mt-5 input-sim">
                                <div>
                                    <input class="no-outline" type="checkbox" name="simlain" value="SIM Lain" id="chkOther" onclick="toggleBoxVisibility()" />
                                    <label>Lainnya</label>
                                </div>
                                <div>Berlaku:</div>
                                <div class="input-date-sim ml-2">
                                    <i class="fa fa-calendar-o ic-field" aria-hidden="true"></i>
                                    <input class="no-outline" name="simlainberlaku" type="date" style="font-size:14px;" />
                                </div>
                                <input class="hide" placeholder="Sebutkan Jenis SIM Lainnya" class="no-outline" style="font-size:16px;" id="otherSIM" />
                            </div>
                            <div class="input-2 mt-5">
                                <div>
                                    <input name="tdkpunyasim" value="false" type="hidden">
                                    <input class="no-outline" type="checkbox" name="tdkpunyasim" value="true" />
                                    <label>Tidak punya</label>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">12.</span>
                            <label>No. NPWP</label>
                        </div>
                        <div class="field-input flex gap-20">
                            <div class="input-1 full-width">
                                <i class="fa fa-id-card-o ic-field" aria-hidden="true"></i>
                                <input placeholder="Nomor NPWP" class="no-outline" name="npwm" type="number" />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">13.</span>
                            <label>Status Pernikahan <span class="red">*</span></label>
                        </div>
                        <div class="field-input">
                            <div class="input-2 mt-5">
                                <input class="no-outline" type="radio" name="statuspernikahan" value="Lajang" checked required />
                                <label>Lajang</label>
                            </div>
                            <div class="input-2 mt-5">
                                <input class="no-outline" type="radio" name="statuspernikahan" value="Menikah" required />
                                <label>Menikah</label>
                            </div>
                            <div class="input-2 mt-5">
                                <input class="no-outline" type="radio" name="statuspernikahan" value="Janda/Duda" required />
                                <label>Janda/Duda</label>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">14.</span>
                            <label>Nama Suami/Istri (Bagi yang sudah menikah)</label>
                        </div>
                        <div class="field-input flex gap-20">
                            <div class="input-1 full-width">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Nama" class="no-outline" name="namapasangan" />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex mb-5 label">
                            <span class="order">15.</span>
                            <label>Jumlah Anak (Bagi yang sudah menikah)</label>
                        </div>
                        <div class="field-input flex gap-20">
                            <div class="input-1 full-width">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Jumlah anak" class="no-outline" name="jmlanak" type="number" />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">16.</span>
                            <label>Anggota keluarga yang dapat dihubungi dalam keadaan darurat <span class="red">*</span></label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Nama Lengkap" class="no-outline" name="namadarurat" required />
                            </div>
                            <div class="input-1 mt-5">
                                <i class="fa fa-handshake-o ic-field" aria-hidden="true"></i>
                                <input placeholder="Hubungan dengan anda ? Orang tua / Saudara" class="no-outline" name="statusdarurat" required />
                            </div>
                            <div class="input-1 mt-5">
                                <i class="fa fa-phone ic-field" aria-hidden="true"></i>
                                <input placeholder="Nomor HP" class="no-outline" name="notelpdarurat" type="number" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">17.</span>
                            <label>Susunan silsilah keluarga <span class="red">*</span></label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Nama Ayah" class="no-outline" name="ayah" required />
                            </div>
                            <div class="input-1 mt-5">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Nama Ibu" class="no-outline" name="ibu" required />
                            </div>
                            <div class="input-1 mt-5">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Saudara 1" class="no-outline" name="saudara1" />
                            </div>
                            <div class="input-1 mt-5">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Saudara 2" class="no-outline" name="saudara2" />
                            </div>
                            <div class="input-1 mt-5">
                                <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                <input placeholder="Saudara 3" class="no-outline" name="saudara3" />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">18.</span>
                            <label>Pendidikan terakhir <span class="red">*</span></label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-graduation-cap ic-field" aria-hidden="true"></i>
                                <input placeholder="SD/SMP/SMA/Universitas" class="no-outline" name="pendidikanterakhir" required />
                            </div>
                        </div>
                        <div class="field-input mt-5">
                            <div class="input-1">
                                <i class="fa fa-graduation-cap ic-field" aria-hidden="true"></i>
                                <input placeholder="Nama sekolah" class="no-outline" name="tempatpendidikan" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">19.</span>
                            <label>Nilai IP/Ranking terakhir <span class="red">*</span></label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-text-width ic-field" aria-hidden="true"></i>
                                <input placeholder="Contoh: Saya ranking 1 dengan nilai A pada saat SMA" class="no-outline" name="nilaipendidikan" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">20.</span>
                            <label>Bahasa yang anda kuasai</label>
                        </div>
                        <table class="field-input-table">
                            <thead>
                                <tr>
                                    <th>Bahasa</th>
                                    <th>Membaca</th>
                                    <!-- <th>Menulis</th> -->
                                    <th>Berbicara</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Inggris</td>
                                    <input name="inggrisbaca" value="false" type="hidden">
                                    <input name="inggrisbicara" value="false" type="hidden">
                                    <td class="center"><input type="checkbox" value="true" name="inggrisbaca" />
                                    <td class="center"><input type="checkbox" value="true" name="inggrisbicara" />
                                </tr>
                                <tr>
                                    <td>Mandarin</td>
                                    <input name="mandarinbaca" value="false" type="hidden">
                                    <input name="mandarinbicara" value="false" type="hidden">
                                    <td class="center"><input type="checkbox" value="true" name="mandarinbaca" />
                                    <td class="center"><input type="checkbox" value="true" name="mandarinbicara" />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">21.</span>
                            <label>Pengalaman Kerja (diisi dari perusahaan yang paling terakhir)</label>
                        </div>
                        <div id="dynamic_field">
                            <div class="field-input card">
                                <div class="field-input grid gap-20 layout-template-1">
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Nama Perusahaan" class="no-outline" name="namaperusahaan[]" />
                                    </div>
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Periode Kerja" class="no-outline" name="periodekerja[]" />
                                    </div>
                                </div>
                                <div class="field-input grid gap-20 layout-template-1">
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Alamat Perusahaan" class="no-outline" name="alamatperusahaan[]" />
                                    </div>
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="No Telepon Atasan" class="no-outline" name="notelpperusahaan[]" type="number" />
                                    </div>
                                </div>
                                <div class="field-input grid gap-20 layout-template-1">
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Jabatan Awal" class="no-outline" name="jabatanawal[]" />
                                    </div>
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Jabatan Terakhir" class="no-outline" name="jabatanakhir[]" />
                                    </div>
                                </div>
                                <div class="field-input grid gap-20 layout-template-1">
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Nama Atasan Langsung" class="no-outline" name="namaatasan[]" />
                                    </div>
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Alasan Berhenti" class="no-outline" name="alasanberhenti[]" />
                                    </div>
                                </div>
                                <div class="field-input grid gap-20 layout-template-1">
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Gaji Terakhir" class="no-outline" name="gajiterakhir[]" type="number" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="footer-table-add">
                            <button class="btn-add-experience" id="add" name="add" type="button" name="add"><i class="fa fa-plus" aria-hidden="true"></i> Tambah Pengalaman</button>
                        </div>
                    </div>

                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">22.</span>
                            <label>Jelaskan jenis pekerjaan dan job desk yang Anda lakukan di perusahaan terakhir? <span class="red">*</span></label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-text-width ic-field" aria-hidden="true"></i>
                                <textarea class="no-outline full-width" id="jenispekerjaanterakhir" name="jenispekerjaanterakhir" rows="4" cols="50" required style="font-size:16px;"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">23.</span>
                            <label>Jelaskan jenis pekerjaan dan job desk yang pernah Anda lakukan di perusahaan lainnya?</label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-text-width ic-field" aria-hidden="true"></i>
                                <textarea class="no-outline full-width" id="jobdeskterakhir" name="jobdeskterakhir" rows="4" cols="50" style="font-size:16px;"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">24.</span>
                            <label>Apakah ada teman / Saudara yang bekerja di perusahaan ini? Jika ya, sebutkan. <span class="red">*</span></label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-text-width ic-field" aria-hidden="true"></i>
                                <input class="no-outline" name="temanbekerja" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">25.</span>
                            <label>Apakah Anda pernah melamar di perusahaan ini sebelumnya? Jika ya, sebutkan sebagai apa? <span class="red">*</span>
                            </label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-text-width ic-field" aria-hidden="true"></i>
                                <input class="no-outline" name="pernahlamar" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">26.</span>
                            <label>Apakah Anda memiliki pekerjaan part time? Jika ya, Sebutkan. <span class="red">*</span>
                            </label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-text-width ic-field" aria-hidden="true"></i>
                                <input class="no-outline" name="parttime" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">27.</span>
                            <label>Apakah Anda keberatan jika kami meminta referensi dari perusahaan Anda sebelumnya? <span class="red">*</span>
                            </label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-text-width ic-field" aria-hidden="true"></i>
                                <input class="no-outline" name="referensikerja" required />
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">28.</span>
                            <label>Macam pekerjaan atau jabatan apakah yang sesuai dengan cita-cita Anda? <span class="red">*</span>
                            </label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-text-width ic-field" aria-hidden="true"></i>
                                <textarea class="no-outline full-width" id="citacita" name="citacita" rows="4" cols="50" required style="font-size:16px;"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">29.</span>
                            <label>Apa yang akan Anda berikan kepada perusahaan jika Anda diterima di perusahaan ini? <span class="red">*</span>
                            </label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-text-width ic-field" aria-hidden="true"></i>
                                <textarea class="no-outline full-width" id="kontribusi" name="kontribusi" rows="4" cols="50" required style="font-size:16px;"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">30.</span>
                            <label>Besar minimal Gaji yang diharapkan? <span class="red">*</span>
                            </label>
                        </div>
                        <div class="field-input">
                            <div class="input-1">
                                <i class="fa fa-text-width ic-field" aria-hidden="true"></i>
                                <input class="no-outline" name="minimalgaji" type="number" id="rupiah1" required />
                            </div>
                        </div>
                    </div>

                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">31.</span>
                            <label>Foto Surat Lamaran <span class="red">*</span>
                            </label>
                        </div>
                        <div class="field-input">
                            <div class="input-3">
                                <img id="lamaranPreview" class="image-upload" src="./ic_image.png" />
                                <input id="uploadLamaran" class="no-outline upload-file" type="file" name="suratlamaran" accept="image/*" onchange="change('lamaranPreview','uploadLamaran');" required />
                                <label for="uploadLamaran" class="label-upload-foto btn-add-experience">Pilih Foto</label>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">32.</span>
                            <label>Foto KTP <span class="red">*</span>
                            </label>
                        </div>
                        <div class="field-input">
                            <div class="input-3">
                                <img id="ktpPreview" class="image-upload" src="./ic_image.png" />
                                <input id="uploadKtp" class="no-outline upload-file" type="file" name="fotoktp" accept="image/*" onchange="change('ktpPreview','uploadKtp');" required />
                                <label for="uploadKtp" class="label-upload-foto btn-add-experience">Pilih Foto</label>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">33.</span>
                            <label>Foto SIM A/B/C (Abaikan jika tidak ada)
                            </label>
                        </div>
                        <div class="field-input">
                            <div class="input-3">
                                <img id="simPreview" class="image-upload" src="./ic_image.png" />
                                <input id="uploadSim" class="no-outline upload-file" type="file" name="fotosim" accept="image/*" onchange="change('simPreview','uploadSim');" />
                                <label for="uploadSim" class="label-upload-foto btn-add-experience">Pilih Foto</label>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">34.</span>
                            <label>Upload Ijazah Terakhir
                            </label>
                        </div>
                        <div class="field-input">
                            <div class="input-3">
                                <img id="ijazahPreview" class="image-upload" src="./ic_image.png" />
                                <input id="uploadIjazah" class="no-outline upload-file" type="file" name="ijazah" accept="image/*" onchange="change('ijazahPreview','uploadIjazah');" />
                                <label for="uploadIjazah" class="label-upload-foto btn-add-experience">Pilih Foto</label>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">35.</span>
                            <label>Upload SKCK
                            </label>
                        </div>
                        <div class="field-input">
                            <div class="input-3">
                                <img id="skckPreview" class="image-upload" src="./ic_image.png" />
                                <input id="uploadSkck" class="no-outline upload-file" type="file" name="skck" accept="image/*" onchange="change('skckPreview','uploadSkck');" />
                                <label for="uploadSkck" class="label-upload-foto btn-add-experience">Pilih Foto</label>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">36.</span>
                            <label>Upload Kartu Keluarga</label>
                        </div>
                        <div class="field-input">
                            <div class="input-3">
                                <img id="kkPreview" class="image-upload" src="./ic_image.png" />
                                <input id="uploadkk" class="no-outline upload-file" type="file" name="kartukeluarga" accept="image/*" onchange="change('kkPreview','uploadkk');" />
                                <label for="uploadkk" class="label-upload-foto btn-add-experience">Pilih Foto</label>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">37.</span>
                            <label>Upload Sertifikat</label>
                        </div>
                        <div class="field-input">
                            <div class="input-3">
                                <img id="sertifikatPreview" class="image-upload" src="./ic_image.png" />
                                <input id="uploadSertifikat" class="no-outline upload-file" type="file" name="sertifikat" accept="image/*" onchange="change('sertifikatPreview','uploadSertifikat');" />
                                <label for="uploadSertifikat" class="label-upload-foto btn-add-experience">Pilih Foto</label>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex  mb-5 label">
                            <span class="order">38.</span>
                            <label>Upload Surat Keterangan Kerja</label>
                        </div>
                        <div class="field-input">
                            <div class="input-3">
                                <img id="kerjaPreview" class="image-upload" src="./ic_image.png" />
                                <input id="uploadKerja" class="no-outline upload-file" type="file" name="keterangankerja" accept="image/*" onchange="change('kerjaPreview','uploadKerja');" />
                                <label for="uploadKerja" class="label-upload-foto btn-add-experience">Pilih Foto</label>
                            </div>
                        </div>
                    </div>
                    <div class="field-wrapper">
                        <div class="flex gap-5 mb-5 label">
                            <label>Pengisian formulir karyawan sudah dianggap benar dan sah dengan menggunakan tanda tangan digital oleh pelamar.</label>
                        </div>


                        <div class="input-3">
                            <div id="sig" class="kbw-signature"></div>
                            <input id="hapus" class="no-outline upload-file" />
                            <label for="hapus" class="label-upload-foto btn-add-experience">Hapus</label>
                            <textarea id="signature64" name="signed" style="display: none"></textarea>
                        </div>


                    </div>
                    <div class="footer-btn-submit">
                        <button class="btn-submit" type="submit" name="upload" onClick='return confirmSubmit()'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        function toggleBoxVisibility() {
            if (document.getElementById("chkOther").checked == true) {
                document.getElementById("otherSIM").style.display = "block";
            } else {
                document.getElementById("otherSIM").style.display = "none";
            }
        }
        var sig = $('#sig').signature({
            syncField: '#signature64',
            syncFormat: 'PNG'
        });
        $('#clear').click(function(e) {
            e.preventDefault();
            sig.signature('clear');
            $("#signature64").val('');
        });


        function confirmSubmit() {
            var agree = confirm("Apakah Anda yakin ingin melanjutkan?");
            if (agree) {
                var otherSIM = document.getElementById('otherSIM').textContent;
                document.getElementById("chkOther").value = otherSIM;
                return true;
            } else
                return false;
        }

        //start handle Image
        function FileListItem(a) {
            a = [].slice.call(Array.isArray(a) ? a : arguments)
            for (var c, b = c = a.length, d = !0; b-- && d;) d = a[b] instanceof File
            if (!d) throw new TypeError("expected argument to FileList is File or array of File objects")
            for (b = (new ClipboardEvent("")).clipboardData || new DataTransfer; c--;) b.items.add(a[c])
            return b.files
        }

        function change(prev, src) {
            var inputFile = document.getElementById(src);
            var file = inputFile.files[0];

            if (!file) return

            file.image().then(img => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                const maxWidth = img.width > img.height ? 960 : 720
                const maxHeight = img.height > img.width ? 960 : 720
                const ratio = Math.min(maxWidth / img.width, maxHeight / img.height)
                const width = img.width * ratio + .5 | 0
                const height = img.height * ratio + .5 | 0

                canvas.width = width
                canvas.height = height

                ctx.drawImage(img, 0, 0, width, height)

                dataurl = canvas.toDataURL(file.type);
                document.getElementById(prev).src = dataurl;

                canvas.toBlob(blob => {
                    const resizedFile = new File([blob], file.name, file)
                    const fileList = new FileListItem(resizedFile)
                    inputFile.onchange = null
                    inputFile.files = fileList
                    inputFile.onchange = change
                })
            })
        }
    </script>
    <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> -->
</body>

</html>

<script type="text/javascript">
    $(document).ready(function() {

        var i = 1;
        $("#add").click(function() {
            i++;

            $('#dynamic_field').append(`<div class="field-input card" id="row${i}">
                                <div class="field-input grid gap-20 layout-template-1">
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Nama Perusahaan" class="no-outline" name="namaperusahaan[]"  />
                                    </div>
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Periode Kerja" class="no-outline" name="periodekerja[]"  />
                                    </div>
                                </div>
                                <div class="field-input grid gap-20 layout-template-1">
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Alamat Perusahaan" class="no-outline" name="alamatperusahaan[]" />
                                    </div>
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="No Telepon Atasan" class="no-outline" name="notelpperusahaan[]" type="number"/>
                                    </div>
                                </div>
                                <div class="field-input grid gap-20 layout-template-1">
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Jabatan Awal" class="no-outline" name="jabatanawal[]" />
                                    </div>
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Jabatan Terakhir" class="no-outline" name="jabatanakhir[]" />
                                    </div>
                                </div>
                                <div class="field-input grid gap-20 layout-template-1">
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Nama Atasan Langsung" class="no-outline" name="namaatasan[]" />
                                    </div>
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Alasan Berhenti" class="no-outline" name="alasanberhenti[]" />
                                    </div>
                                </div>
                                <div class="field-input grid gap-20 layout-template-1">
                                    <div class="input-1 mt-5">
                                        <i class="fa fa-user ic-field" aria-hidden="true"></i>
                                        <input placeholder="Gaji Terakhir" class="no-outline" name="gajiterakhir[]" type="number"/>
                                    </div>
                                    <div class="input-1 mt-5 no-border">
                                    <button type="button" name="remove" id="${i}" class="btn_remove"><i class="fa fa-minus" aria-hidden="true"></i> Hapus</button>
                                    </div>
                                    </div>
                            </div>`);
        });

        $(document).on('click', '.btn_remove', function() {
            var button_id = $(this).attr("id");
            $('#row' + button_id + '').remove();
        });
    });
</script>