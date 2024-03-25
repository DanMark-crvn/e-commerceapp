import axios from "axios";

export function writeDataToFile(data) {
    const jsonData = JSON.stringify(data, null, 2);
    localStorage.setItem('formData', jsonData); //Setting the data to LoalStorage
    axios.post('http://localhost:3000/items', jsonData)
    .then(res => {
        console.log(res);
    })
    .catch(err => console.log(err));
}






