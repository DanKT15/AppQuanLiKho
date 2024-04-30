import { useEffect, useState } from "react";
import QrScanner from "../component/QrScanner";
import Phieu from "../component/Phieu";
import axios from 'axios';
import store from "../Security/AsyncStorage";
import {pathURL} from 'react-native-dotenv';

export default function Scanner({ navigation }) {

    const [check, setcheck] = useState(false);
    const [dataSP, setdataSP] = useState([]);
    const [dataQR, setdataQR] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [messscanned, setMessScanned] = useState(null);
    const [diachiSP, setdiachiSP] = useState([]);

    const AddData = (id_sp, title, soluong) => {

        setdataSP([
             ...dataSP, 
            { 
                id: id_sp,
                title: title, 
                soluong: soluong
            },
        ]);

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

    useEffect(() => {
        const getdiachi = async () => {

            const getkey = await store.getData();
            const response = await axios.get(`${pathURL}/api/getdiachi`, {
            headers: {
                "Accept": "application/json",
                "Content-Type" : "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": getkey
            }
            });
    
            if (response.data.errors === 1) {
            console.log(response.data.message);
            }
            else {
                const diachitamp = response.data.diachi;
                let arrtamp = [];
                diachitamp.map((item) => {
                    arrtamp.push({label: item.TENDC, value: item.MADC});
                });
                setdiachiSP(arrtamp);
            }
        };
        getdiachi();
    }, []);

    return(
        <>
            {
                check ? 
                <Phieu 
                    diachiSP={diachiSP}
                    dataSP={dataSP} 
                    setdataQR={setdataQR} 
                    dataQR={dataQR} 
                    setcheck={setcheck} 
                    AddDataSP={AddData} 
                    ChangeDataSP={ChangeData} 
                    ResetData={ResetData} 
                    setScanned={setScanned} 
                    setMessScanned={setMessScanned}
                /> 
                : 
                <QrScanner 
                    setcheck={setcheck} 
                    setdataQR={setdataQR} 
                    scanned={scanned} 
                    messscanned={messscanned}
                />
            }
        </>
    );
    
};