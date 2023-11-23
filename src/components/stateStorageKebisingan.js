import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
export default function stateStorageKebisingan(key) {
    const [storage, setStorage] = useState(AsyncStorage.getItem('kebisingan'));
    useEffect(() => {
        AsyncStorage.getItem(key).then((value) => {
            let data = JSON.parse(value);
            if(data.noSample){
                setStorage(data)
            } else {
                var kebisingan = new Object();
                kebisingan.no_sample = '';
                kebisingan.keterangan_4 = '';
                kebisingan.penamaanTambahan = '';
                kebisingan.sumber_keb = '';
                kebisingan.jen_frek = '';
                kebisingan.posisi = '';
                kebisingan.lat = '';
                kebisingan.longi = '';
                kebisingan.waktu = '';
                kebisingan.jenisPengujian = '';
                kebisingan.jenis_durasi = '';
                kebisingan.shiftPengambilan = '';
                kebisingan.suhu_udara = '';
                kebisingan.kelembapan_udara = '';
                kebisingan.kebisingan = [];
                kebisingan.foto_lain = '';
                kebisingan.foto_lok = '';
                AsyncStorage.setItem(key, JSON.stringify(kebisingan));
                setStorage(kebisingan)
            }
        })
    }, []);
    
    return storage
}