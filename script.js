let chart=null

function creaTabella(){

let numero = parseInt(document.getElementById("HostNumber").value)
let tabella = document.getElementById("tabellaHost")

tabella.innerHTML=""

if(isNaN(numero) || numero<=0){
alert("Inserisci un numero valido")
return
}

for(let i=0;i<numero;i++){

let riga=`
<tr>
<td><input type="number" class="hostInput" min="1"></td>
<td class="effettivi"></td>
<td class="bit"></td>
<td class="totali"></td>
<td class="mask"></td>
<td class="network"></td>
<td class="first"></td>
<td class="last"></td>
<td class="broadcast"></td>
<td class="range"></td>
</tr>
`

tabella.innerHTML+=riga

}

if(chart){
chart.destroy()
}

}

function ordina(){

let tbody=document.getElementById("tabellaHost")
let righe=Array.from(tbody.rows)

righe.sort((a,b)=>{

let aVal=parseInt(a.querySelector(".hostInput").value)||0
let bVal=parseInt(b.querySelector(".hostInput").value)||0

return bVal-aVal

})

tbody.innerHTML=""
righe.forEach(r=>tbody.appendChild(r))

}

function calcolaVLSM(){

let baseIP=document.getElementById("baseIP").value.trim()

if(!validaIP(baseIP)){
alert("IP non valido")
return
}

ordina()

let righe=document.querySelectorAll("#tabellaHost tr")

let current=ipToNumber(baseIP)
let errore=false

righe.forEach((riga,index)=>{

let input=riga.querySelector(".hostInput")
let host=parseInt(input.value)

// 🔥 VALIDAZIONE FORTE
if(isNaN(host) || host <= 0){

input.style.background="#7f1d1d"
errore=true
return

}else{
input.style.background=""
}

let effettivi=host+3

let bit=0
while(Math.pow(2,bit)<effettivi){
bit++
}

let totali=Math.pow(2,bit)
let mask=32-bit

let network=current
let broadcast=current+totali-1
let first=network+1
let last=broadcast-1

riga.querySelector(".effettivi").innerText=effettivi
riga.querySelector(".bit").innerText=bit
riga.querySelector(".totali").innerText=totali
riga.querySelector(".mask").innerText="/"+mask

riga.querySelector(".network").innerText=numberToIP(network)
riga.querySelector(".first").innerText=numberToIP(first)
riga.querySelector(".last").innerText=numberToIP(last)
riga.querySelector(".broadcast").innerText=numberToIP(broadcast)
riga.querySelector(".range").innerText=
numberToIP(first)+" - "+numberToIP(last)

current=broadcast+1

})

if(errore){
alert("Ci sono host non validi (negativi, zero o vuoti)")
return
}

creaGrafico()

}

function validaIP(ip){

let p=ip.split(".")

if(p.length!=4) return false

for(let n of p){

n=parseInt(n)

if(isNaN(n)||n<0||n>255) return false
}

return true

}

function ipToNumber(ip){

let p=ip.split(".").map(Number)

return p[0]*256*256*256+
p[1]*256*256+
p[2]*256+
p[3]

}

function numberToIP(num){

let a=Math.floor(num/(256*256*256))
num%=256*256*256

let b=Math.floor(num/(256*256))
num%=256*256

let c=Math.floor(num/256)

let d=num%256

return a+"."+b+"."+c+"."+d

}

function creaGrafico(){

let righe=document.querySelectorAll("#tabellaHost tr")

let labels=[]
let dati=[]

righe.forEach((riga,i)=>{

let host=parseInt(riga.querySelector(".hostInput").value)

if(!host || host<=0) return

labels.push("Rete "+(i+1))
dati.push(host)

})

let ctx=document.getElementById("reteChart")

if(chart){
chart.destroy()
}

chart=new Chart(ctx,{
type:'pie',
data:{
labels:labels,
datasets:[{
data:dati,
backgroundColor:[
"#3b82f6",
"#22c55e",
"#f59e0b",
"#ef4444",
"#8b5cf6",
"#14b8a6"
]
}]
},
options:{
plugins:{
legend:{
labels:{
color:"white"
}
}
}
}
})

}