const fs = require('fs')

try {
  var data = fs.readFileSync('/Users/srimaan/Downloads/test/test.json', 'utf8')
  //let x=data;
  //console.log(data, x)
  //console.log(data.length)
} catch (err) {
  console.error(err)
}

console.log(stringParser(data));
//console.log(numparser(data))


function stringParser(input){
	if(input[0]!=='"') return null;
	let output='"',i=1, splObj= { "f":'\f', 'b':'\b', 'r':'\r','t':'\t','n':"\n", '"':'\"' , '\\':'\\', '/':'\/'}; 
	for(i; i<input.length; i++){
		if(input[i]==='\t'||input[i]==='\n') return null
		if(input[i]==='\\' && !("fbrtnu\"\\/").includes(data[i+1])) return null;
		if(input[i]==='\\' && input[i+1] in splObj ){
			console.log(splObj[input[i],'a',input[i+1]],232)
			output+=splObj[input[i+1]];
			i++;
		}else if(input[i]==='\\' && input[i+1]==='u'){
			output+= String.fromCharCode(parseInt(data.slice(i+2,i+6),16));
			i+=5;
		}else{
			output+= input[i];
			if (input[i]==='"') break;
		}
		console.log(i, input[i], output)
	}
	console.log(input,1, output,i);
	return [output,input.slice(i+1)];
}