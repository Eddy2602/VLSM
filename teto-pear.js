
// ➕ AGGIUNGI VLAN
function aggiungiRiga(){

let tabella=document.getElementById("tabellaManuale")

let riga=`
<tr>
<td><input type="text" class="networkInput" placeholder="192.168.10.0"></td>
<td><input type="number" class="maskInput" placeholder="24" min="0" max="32"></td>
<td class="first"></td>
<td class="last"></td>
<td class="broadcast"></td>
<td class="range"></td>
</tr>
`

tabella.insertAdjacentHTML("beforeend", riga)
}


// 🗑️ ELIMINA ULTIMA VLAN
function rimuoviUltimaRiga(){

let tabella=document.getElementById("tabellaManuale")
let righe=tabella.querySelectorAll("tr")

if(righe.length>0){
righe[righe.length-1].remove()
}
}


// 🔢 CREA TABELLA AUTOMATICA
function creaTabellaManuale(){

let numero=parseInt(document.getElementById("numVlan").value)
let tabella=document.getElementById("tabellaManuale")

tabella.innerHTML=""

if(isNaN(numero) || numero<=0){
alert("Inserisci un numero valido")
return
}

for(let i=0;i<numero;i++){

let riga=`
<tr>
<td><input type="text" class="networkInput" value="192.168.${i*10}.0"></td>
<td><input type="number" class="maskInput" value="24" min="0" max="32"></td>
<td class="first"></td>
<td class="last"></td>
<td class="broadcast"></td>
<td class="range"></td>
</tr>
`

tabella.insertAdjacentHTML("beforeend", riga)
}

}


// 🧠 CALCOLO PRINCIPALE
function calcolaManuale(){

let erroreBox=document.getElementById("erroreBox")
erroreBox.innerText=""

let righe=document.querySelectorAll("#tabellaManuale tr")

let subnetList=[]
let errori=[]

righe.forEach(r=>r.classList.remove("errore"))

righe.forEach((riga,index)=>{

let ip=riga.querySelector(".networkInput").value.trim()
let mask=parseInt(riga.querySelector(".maskInput").value)

// ❌ IP non valido
if(!validaIP(ip)){
errori.push("IP non valido riga "+(index+1))
riga.classList.add("errore")
return
}

// ❌ MASK
if(isNaN(mask) || mask<0 || mask>32){
errori.push("Mask non valida riga "+(index+1))
riga.classList.add("errore")
return
}

let ipNum=ipToNumber(ip)

let hostBits=32-mask
let totale=Math.pow(2,hostBits)

let network=ipNum
let broadcast=ipNum+totale-1
let first=network+1
let last=broadcast-1

// ⚠️ CONTROLLO IMPORTANTE: NETWORK VALIDO
if(!isNetworkAddress(ipNum, mask)){
errori.push("Indirizzo rete non valido riga "+(index+1))
riga.classList.add("errore")
return
}

// /31 e /32
if(mask>=31){
first=network
last=broadcast
}

riga.querySelector(".first").innerText=numberToIP(first)
riga.querySelector(".last").innerText=numberToIP(last)
riga.querySelector(".broadcast").innerText=numberToIP(broadcast)
riga.querySelector(".range").innerText=
numberToIP(first)+" - "+numberToIP(last)

subnetList.push({
row:riga,
start:network,
end:broadcast,
index:index+1
})

})


// 🔥 OVERLAP CHECK
for(let i=0;i<subnetList.length;i++){
for(let j=i+1;j<subnetList.length;j++){

let a=subnetList[i]
let b=subnetList[j]

if(a.start <= b.end && b.start <= a.end){

a.row.classList.add("errore")
b.row.classList.add("errore")

errori.push("Overlap tra riga "+a.index+" e "+b.index)
}
}
}


// OUTPUT
if(errori.length>0){
erroreBox.innerText=errori.join(" | ")
}

}


// ✔ IP VALIDO
function validaIP(ip){

let p=ip.split(".")

if(p.length!=4) return false

for(let n of p){

n=parseInt(n)

if(isNaN(n)||n<0||n>255) return false
}

return true
}


// 🧠 CONTROLLO NETWORK CORRETTO
function isNetworkAddress(ipNum, mask){

let hostBits=32-mask

let maskBits = Math.pow(2, hostBits) - 1

// se host bits sono tutti 0 → rete valida
return (ipNum & maskBits) === 0
}


// 🔢 IP → NUMERO
function ipToNumber(ip){

let p=ip.split(".").map(Number)

return p[0]*256*256*256+
p[1]*256*256+
p[2]*256+
p[3]
}


// 🔢 NUMERO → IP
function numberToIP(num){

let a=Math.floor(num/(256*256*256))
num%=256*256*256

let b=Math.floor(num/(256*256))
num%=256*256

let c=Math.floor(num/256)

let d=num%256

return a+"."+b+"."+c+"."+d
}