function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class Alert {
  constructor() {
  }

   async init(){
      this.data = await this.getData();
      if (this.data.length > 0){

        const maindiv = document.querySelector("main"); 
        let alertsection = document.createElement("section");
        alertsection.classList.add("alert-list");
        maindiv.prepend(alertsection);
        
        this.data.forEach(alert => {  
          let alertP = document.createElement("p");
          alertP.innerHTML = alert.message;
          alertP.style.backgroundColor = alert.background;
          alertP.style.color = alert.color;
          alertsection.appendChild(alertP)
        });

        //document.prepend(<section class="alert-list"></section>)
      }
      }
      async getData() {
        const res = await fetch("../json/alerts.json");

        const data = await convertToJson(res);
        return data;
      }
      
    }
    
    
    const newAlert = new Alert()
    newAlert.init()