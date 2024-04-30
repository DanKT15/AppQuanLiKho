import { StyleSheet, Text, View, Button } from "react-native";
import { useEffect, useState } from "react";
import QrScanner from "../component/QrScanner";
import Phieu from "../component/Phieu";

export default function Scanner({ navigation }) {

    const [check, setcheck] = useState(false);
    const [dataSP, setdataSP] = useState([]);
    const [dataQR, setdataQR] = useState(null);
    const [form, setform] = useState([]);

    const AddData = (id_sp, title, soluong) => {

        let idsp = dataSP.length - 1;

        setdataSP([
             ...dataSP, 
            { 
                id: idsp + 1,
                id_sp: id_sp,
                title: title, 
                soluong: soluong
            },
        ]);

    //     setform([
    //         ...form, 
    //        { 
    //            MASP: id_sp,
    //            SOLUONG: soluong
    //        },
    //    ]);
    };

    const ResetData = () => {
        setdataSP([]);
    };

    const ChangeData = (item) => {
        setdataSP(
            dataSP.map(
                (e) => {
                    if (e.id === item.id) {
                        return item
                    } 
                    else {
                        return e
                    }
                }
            )
        );
    };

    return(
        <>
            {
                check ? 
                <Phieu dataSP={dataSP} dataQR={dataQR} setcheck={setcheck} AddDataSP={AddData} ChangeDataSP={ChangeData} ResetData={ResetData} /> 
                : 
                <QrScanner setcheck={setcheck} setdataQR={setdataQR}/>
            }
        </>
    );
    
};