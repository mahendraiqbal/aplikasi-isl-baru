import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  Vibration,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  TouchableOpacity,
  ScrollView,
  Button,
  Platform,
} from "react-native";
import Loader from "./Loader";
import SelectDropdown from "react-native-select-dropdown";
import { Icon, IconButton, MD3Colors } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import { Camera, FlashMode } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DataFormFdl = ({
  jenisFdl,
  storeSate,
  handleInputChange,
  takePicture,
  handleSubmitButton,
  RenderInput,
  Calculate,
  showDate,
  onChange,
  handleSaveButton,
  handleCancelButton,
  handleFotoLokasi,
  handleFotoLain,
  toggleCameraType,
  getLocation,
  noSample,
  setNosample,
  errortext,
  showForm,
  penamaanTitik,
  setPenamaanTitik,
  isEditing,
  setIsEditing,
  penamaanTambahan,
  setPenamaanTambahan,
  sumberKebisingan,
  setSumberKebisingan,
  jenisFrekunsi,
  setJenisFrekuensi,
  titikKoordinatSampling,
  setTitikKoordinatSampling,
  jamPengambilan,
  setJamPengambilan,
  jenisPengujian,
  setJenisPengujian,
  kategori_pengujian,
  setKategoriPengujian,
  shiftPengambilan,
  setShiftPengambilan,
  suhuUdara,
  setSuhuUdara,
  kelembapanUdara,
  setKelembapanUdara,
  lat,
  setLat,
  longi,
  setLongi,
  fotoLain,
  setFotoLain,
  fotoLok,
  setFotoLok,
  frekuensi,
  showPicker,
  setShowPicker,
  pengujian,
  shift_,
  setShift_,
  showData_,
  setShowData_,
  sec,
  setSec,
  currentInput,
  setCurrentInput,
  showLoopData,
  setShowLoopData,
  loopData,
  setLoopData,
  image,
  setImage,
  imageLain,
  setImageLain,
  loading,
  setLoading,
  showCamera,
  tanggal,
  setTanggal,
  isModalVisible,
  type,
  closeCamera,
  setCamera,
}) => {
  const kategoriPengujianRef = useRef();
  console.log(penamaanTitik)
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Loader loading={loading} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Image
              source={require("../../assets/isl.png")}
              style={{
                width: "70%",
                height: 100,
                resizeMode: "contain",
                marginTop: 0,
              }}
            />
          </View>
          <KeyboardAvoidingView enabled>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(NoSample) => {
                  setNosample(NoSample);
                  var val = new Object();
                  val.no_sample = NoSample;
                  storeSate(val);
                }}
                underlineColorAndroid="#f000"
                placeholder="Enter No Sample"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="sentences"
                returnKeyType="next"
                blurOnSubmit={false}
                value={noSample}
              />
            </View>

            {errortext !== "" ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}

            {!showForm ? (
              <>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={handleSubmitButton}
                >
                  <Text style={styles.buttonTextStyle}>PROCESS</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.SectionStyle}>
                  <Text style={styles.textLabel}>Penamaan Titik</Text>
                  <TextInput
                    style={styles.inputStyle}
                    // onChangeText={(PenamaanTitik) => {
                    //   setPenamaanTitik(PenamaanTitik);
                    //   var val = new Object();
                    //   val.keterangan_4 = PenamaanTitik;
                    //   storeSate(val);
                    // }}
                    onChangeText={(PenamaanTitik) => {
                        setPenamaanTitik(PenamaanTitik);
                        var val = new Object();
                        val.keterangan_4 = PenamaanTitik;
                        storeSate(val);
                      }}
                    value={penamaanTitik}
                    underlineColorAndroid="#f000"
                    placeholder="Enter Penamaan Titik"
                    placeholderTextColor="#8b9cb5"
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
                <View style={styles.SectionStyle}>
                  <Text style={styles.textLabel}>Penamaan Tambahan</Text>
                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={(PenamaanTambahan) => {
                      setPenamaanTambahan(PenamaanTambahan);
                      var val = new Object();
                      val.penamaanTambahan = PenamaanTambahan;
                      storeSate(val);
                    }}
                    underlineColorAndroid="#f000"
                    placeholder="Enter Penamaan Tambahan"
                    placeholderTextColor="#8b9cb5"
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    value={penamaanTambahan}
                    editable={true}
                  />
                </View>
                <View style={styles.SectionStyle}>
                  <Text style={styles.textLabel}>Sumber Kebisingan</Text>
                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={(SumberKebisingan) => {
                      SumberKebisingan = SumberKebisingan || "";

                      setSumberKebisingan(SumberKebisingan);
                      var val = new Object();
                      val.sumber_keb = SumberKebisingan;
                      storeSate(val);
                    }}
                    underlineColorAndroid="#f000"
                    placeholder="Enter Sumber Kebisingan"
                    placeholderTextColor="#8b9cb5"
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    value={isEditing ? local.sumber_keb : sumberKebisingan}
                    editable={true}
                  />
                </View>
                <View style={styles.SectionStyle}>
                  <Text style={styles.textLabel}>Jenis Frekuensi</Text>
                  <SelectDropdown
                    style={styles.inputStyle}
                    data={frekuensi}
                    onSelect={(selectedItem, index) => {
                      setJenisFrekuensi(selectedItem);
                      var val = new Object();
                      val.jen_frek = selectedItem;
                      storeSate(val);
                      console.log(selectedItem);
                    }}
                    defaultButtonText={"Select Frekuensi"}
                    buttonStyle={styles.inputStyle}
                    buttonTextStyle={{ fontSize: 16 }}
                  />
                </View>
                <View>
                  <Text style={{ marginLeft: 20, marginTop: 10, fontSize: 16 }}>
                    Titik Koordinat Sampling
                  </Text>
                  <View style={styles.SectionStyleLocation}>
                    <TextInput
                      style={styles.inputLocation}
                      onChangeText={(text) => {
                        setTitikKoordinatSampling(text);
                        var val = new Object();
                        val.posisi = text;
                        storeSate(val);
                      }}
                      value={titikKoordinatSampling}
                      underlineColorAndroid="#f000"
                      placeholder="Titik Koordinat Sampling"
                      placeholderTextColor="#8b9cb5"
                      autoCapitalize="sentences"
                      returnKeyType="next"
                      blurOnSubmit={false}
                    />
                    <TouchableOpacity
                      style={styles.buttonStyleLocation}
                      activeOpacity={0.5}
                      onPress={getLocation}
                    >
                      <Text style={styles.buttonTextStyle}>Get Location</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.SectionRow}>
                  <View style={styles.SectionStyleRow}>
                    <Text style={styles.textLabel}>Jam Pengambilan</Text>
                    <View style={styles.SectionRow}>
                      <TextInput
                        style={styles.inputStyle}
                        onChangeText={(JamPengambilan) => {
                          setJamPengambilan(JamPengambilan);
                          console.log(jamPengambilan);
                          storeSate({ jamPengambilan: JamPengambilan });
                        }}
                        editable={false}
                        value={jamPengambilan}
                        underlineColorAndroid="#f000"
                        placeholder="Enter Jam Pengambilan"
                        placeholderTextColor="#8b9cb5"
                        autoCapitalize="sentences"
                        returnKeyType="next"
                        blurOnSubmit={false}
                      />
                      {showPicker && (
                        <DateTimePicker
                          mode={"time"}
                          value={tanggal}
                          is24Hour={true}
                          display="default"
                          onChange={onChange}
                        />
                      )}
                      <TouchableOpacity
                        style={{
                          backgroundColor: "green",
                          borderRadius: 10,
                          height: 40,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <IconButton
                          icon="clock-time-three-outline"
                          size={20}
                          iconColor={MD3Colors.secondary100}
                          onPress={showDate}
                        ></IconButton>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.SectionStyleRow}>
                    <Text style={styles.textLabel}>Jenis Pengujian</Text>
                    <SelectDropdown
                      style={styles.inputStyle}
                      data={pengujian}
                      onSelect={(selectedItem, index) => {
                        setJenisPengujian(selectedItem);
                        var val = new Object();
                        val.jenisPengujian = selectedItem;
                        storeSate(val);
                        console.log(selectedItem);
                      }}
                      defaultButtonText={"Select Jenis Pengujian"}
                      buttonStyle={styles.inputStyle}
                      buttonTextStyle={{ fontSize: 16 }}
                    />
                  </View>
                </View>

                <View style={styles.SectionRow}>
                  <View style={styles.SectionStyleRow}>
                    <Text style={styles.textLabel}>Kategori Pengujian</Text>
                    <SelectDropdown
                      style={styles.inputStyle}
                      data={kategori_pengujian}
                      onSelect={(selectedItem, index) => {
                        kategoriPengujianRef.current.reset();
                        console.log(selectedItem.kategori);
                        setKategoriPengujian(selectedItem.kategori);
                        setShift_(selectedItem.shift);
                        var val = new Object();
                        val.jenis_durasi = selectedItem.kategori;
                        // val.shift_ = selectedItem.shift;
                        storeSate(val);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem.kategori;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item.kategori;
                      }}
                      defaultButtonText={"Select Jenis Pengujian"}
                      buttonStyle={styles.inputStyle}
                      buttonTextStyle={{ fontSize: 15 }}
                    />
                  </View>
                  <View style={styles.SectionStyleRow}>
                    <Text style={styles.textLabel}>Shift Pengambilan</Text>
                    <SelectDropdown
                      style={styles.inputStyle}
                      ref={kategoriPengujianRef}
                      data={shift_}
                      onSelect={(selectedItem, index) => {
                        setShiftPengambilan(selectedItem);
                        var val = new Object();
                        val.shiftPengambilan = selectedItem;
                        storeSate(val);
                        console.log(selectedItem);
                      }}
                      defaultButtonText={"Select Shift"}
                      buttonStyle={styles.inputStyle}
                      buttonTextStyle={{ fontSize: 15 }}
                    />
                  </View>
                </View>

                <View style={styles.SectionRow}>
                  <View style={styles.SectionStyleRow}>
                    <Text style={styles.textLabel}>Suhu Udara</Text>
                    <TextInput
                      style={styles.inputStyle}
                      keyboardType="number-pad"
                      onChangeText={(SuhuUdara) => {
                        setSuhuUdara(SuhuUdara);
                        var val = new Object();
                        val.suhu_udara = SuhuUdara;
                        storeSate(val);
                      }}
                      underlineColorAndroid="#f000"
                      placeholder="Enter Suhu Udara"
                      placeholderTextColor="#8b9cb5"
                      autoCapitalize="sentences"
                      returnKeyType="next"
                      blurOnSubmit={false}
                    />
                  </View>
                  <View style={styles.SectionStyleRow}>
                    <Text style={styles.textLabel}>Kelembapan Udara</Text>
                    <TextInput
                      style={styles.inputStyle}
                      keyboardType="number-pad"
                      onChangeText={(KelembapanUdara) => {
                        setKelembapanUdara(KelembapanUdara);
                        var val = new Object();
                        val.kelembapan_udara = KelembapanUdara;
                        storeSate(val);
                      }}
                      underlineColorAndroid="#f000"
                      placeholder="Enter Kelembapan Udara"
                      placeholderTextColor="#8b9cb5"
                      autoCapitalize="sentences"
                      returnKeyType="next"
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                <View style={styles.SectionStyle}>
                  {showData_ && (
                    <Text style={styles.textLabel}>Data Ke - {sec}</Text>
                  )}
                  {showData_ && (
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={handleInputChange}
                      keyboardType="number-pad"
                      underlineColorAndroid="#f000"
                      placeholder="Enter Data"
                      placeholderTextColor="#8b9cb5"
                      autoCapitalize="sentences"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      value={currentInput}
                    />
                  )}
                </View>
                {showLoopData && (
                  <SafeAreaView style={styles.SectionRowLoop}>
                    {loopData}
                  </SafeAreaView>
                )}
                <View style={styles.SectionRow}>
                  <View style={styles.SectionStyleRow}>
                    <Text style={styles.textLabel}>Lokasi Sampling</Text>
                    <TouchableOpacity
                      style={styles.buttonTake}
                      onPress={handleFotoLokasi}
                    >
                      <View style={styles.SectionRow}>
                        <Icon source="camera" color="white" size={20} />
                        <Text style={styles.textTake}> Open Camera</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.SectionStyleRow}>
                    <Text style={styles.textLabel}>Foto Lain-lain</Text>
                    <TouchableOpacity
                      style={styles.buttonTake}
                      onPress={handleFotoLain}
                    >
                      <View style={styles.SectionRow}>
                        <Icon source="camera" color="white" size={20} />
                        <Text style={styles.textTake}> Open Camera</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.SectionRow}>
                  <View style={styles.SectionStyleRow}>
                    {image && (
                      <Image
                        source={{ uri: image }}
                        style={styles.imageRender}
                      />
                    )}
                  </View>
                  <View style={styles.SectionStyleRow}>
                    {imageLain && (
                      <Image
                        source={{ uri: imageLain }}
                        style={styles.imageRender}
                      />
                    )}
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  {showCamera && (
                    <View style={styles.container}>
                      <Modal isVisible={isModalVisible}>
                        <Camera
                          style={styles.camera}
                          type={Camera.Constants.Type.back}
                          ref={(ref) => setCamera(ref)}
                        >
                          <SafeAreaView style={styles.header}></SafeAreaView>
                          <SafeAreaView>
                            <View style={styles.footer}>
                              <IconButton
                                onPress={closeCamera}
                                icon="close"
                                size={35}
                                iconColor={MD3Colors.secondary100}
                              />
                              <TouchableOpacity onPress={takePicture}>
                                <View style={styles.snapButton}>
                                  <View style={styles.innerSnapButton}>
                                    <Icon
                                      source="camera"
                                      color="white"
                                      size={35}
                                    />
                                  </View>
                                </View>
                              </TouchableOpacity>
                              <IconButton
                                icon="rotate-360"
                                size={35}
                                onPress={toggleCameraType}
                                iconColor={MD3Colors.secondary100}
                              />
                            </View>
                          </SafeAreaView>
                        </Camera>
                      </Modal>
                    </View>
                  )}
                </View>


                <View style={styles.SectionRow} marginBottom={30}>
                  <View style={styles.SectionStyleRow}>
                    <TouchableOpacity
                      style={styles.cancelButtonStyle}
                      activeOpacity={0.5}
                      onPress={handleCancelButton}
                    >
                      <Text style={styles.buttonTextStyle}>CANCEL</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.SectionStyleRow}>
                    <TouchableOpacity
                      style={styles.saveButtonStyle}
                      activeOpacity={0.5}
                      onPress={handleSaveButton}
                    >
                      <Text style={styles.buttonTextStyle}>SAVE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },

  buttonTake: {
    alignItems: "center",
    backgroundColor: "#1867e6",
    padding: 10,
    width: "100%",
    borderRadius: 10,
  },

  buttonBrowse: {
    alignItems: "center",
    backgroundColor: "#1867e6",
    padding: 10,
    margin: 20,
  },
  buttonTakePicture: {
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    margin: 20,
  },
  textTake: {
    color: "white",
    fontSize: 16,
  },
  textBrowse: {
    color: "white",
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  SectionStyle: {
    flexDirection: "column",
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    margin: 10,
  },

  SectionStyleRow: {
    flexDirection: "column",
    marginTop: 10,
    marginLeft: 20,
    marginRight: 10,
    margin: 10,
    width: "41%",
  },

  SectionStyleLocation: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    margin: 10,
  },

  SectionRow: {
    display: "flex",
    flexDirection: "row",
  },

  SectionRowLoop: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  textLabel: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "left",
  },

  textLabelLoop: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 10,
    textAlign: "left",
    flexWrap: "wrap",
    width: "100%",
  },
  buttonStyle: {
    backgroundColor: "green",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "green",
    height: 40,
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 20,
    // width: '80%'
  },
  buttonStyleLocation: {
    backgroundColor: "blue",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 5,
    width: "22%",
  },
  saveButtonStyle: {
    backgroundColor: "green",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "green",
    height: 40,
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
  },
  cancelButtonStyle: {
    backgroundColor: "red",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "red",
    height: 40,
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    padding: 5,
    fontSize: 16,
  },

  inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#dadae8",
    width: "100%",
    fontSize: 16,
    height: 40,
  },
  inputStyleLoop: {
    flex: 1,
    color: "black",
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#dadae8",
    fontSize: 16,
    height: 40,
    alignSelf: "flex-start",
    minWidth: "22%",
    margin: 5,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 26,
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
  cameraButtonStyle: {
    backgroundColor: "blue",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "blue",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  inputLocation: {
    width: "75%",
    height: 40,
    color: "black",
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#dadae8",
    fontSize: 16,
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  snapButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "#fff",
    marginBottom: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  innerSnapButton: {
    backgroundColor: "pink",
    width: 56,
    height: 55,
    borderRadius: 25.5,
    justifyContent: "center",
    alignItems: "center",
  },
  imageRender: {
    width: 170,
    height: 170,
    padding: 10,
    borderRadius: 30,
  },
});

export default DataFormFdl;
