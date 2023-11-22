import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
export default function stateStorageKebisingan(key) {
    const [storage, setStorage] = useState([]);
    useEffect(() => {
        AsyncStorage.getItem(key).then((value) => {
            if(value.noSample!=null){
                setStorage(JSON.parse(value))
            } else {
                var kebisingan = new Object();
                kebisingan.noSample = '';
                kebisingan.penamaanTitik = '';
                kebisingan.penamaanTambahan = '';
                kebisingan.sumberKebisingan = '';
                kebisingan.jenisFrekuensi = '';
                kebisingan.titikKoordinatSampling = '';
                kebisingan.lat = '';
                kebisingan.long = '';
                kebisingan.jamPengambilan = '';
                kebisingan.jenisPengujian = '';
                kebisingan.kategoriPengujian = '';
                kebisingan.shiftPengambilan = '';
                kebisingan.suhuUdara = '';
                kebisingan.kelembapanUdara = '';
                kebisingan.dataArray = [];
                AsyncStorage.setItem(key, JSON.stringify(kebisingan));
                setStorage(kebisingan)
            }
        })
    }, []);
    
    return storage
}