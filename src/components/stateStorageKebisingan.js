import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export default function stateStorageKebisingan(key) {
  const storeSate = async (data) => {
    try {
      const existingData = await AsyncStorage.getItem(key);
      const parsedData = JSON.parse(existingData) || {};
      const updatedData = { ...parsedData, ...data };
      await AsyncStorage.setItem(key, JSON.stringify(updatedData));
      console.log(updatedData);
    } catch (error) {
      console.error('Error storing data:', error);
      Alert.alert('Can not Sync..');
    }
  };

  const [storage, setStorage] = useState({});
  useEffect(() => {
    AsyncStorage.getItem(key).then((value) => {
      let data = JSON.parse(value);
      if (data && data.no_sample) {
        setStorage(data);
      } else {
        var kebisingan = {
          no_sample: '',
          keterangan_4: '',
          penamaanTambahan: '',
          sumber_keb: '',
          jen_frek: '',
          posisi: '',
          lat: '',
          longi: '',
          waktu: '',
          jenisPengujian: '',
          jenis_durasi: '',
          shiftPengambilan: '',
          suhu_udara: '',
          kelembapan_udara: '',
          kebisingan: [],
          foto_lain: '',
          foto_lok: '',
        };
        AsyncStorage.setItem(key, JSON.stringify(kebisingan));
        setStorage(kebisingan);
      }
    });
  }, [key]);

  return { storage, storeSate };
}