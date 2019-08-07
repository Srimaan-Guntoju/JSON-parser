const fs = require('fs')

//let input=
var input = fs.readFileSync('/Users/srimaan/Downloads/test/passGS.json', 'utf8')
//console.log(objectparser(input));
console.log(valueparser(input));
for(let i=1; i<34; i++){
  let str= '/Users/srimaan/Downloads/test/fail'+i+'.json'
  try {
    var input = fs.readFileSync(str, 'utf8')
  } catch (err) {
    console.error(err)
  }
  //console.log(i, valueparser(input));
}
function globalparser(input){
	let result= valueparser(input);
	if (result[1].length!==0) return null;
	return result[0];
}

function valueparser(input){
  let funcArr=[numparser, booleanparser, stringParser , objectparser, arrayparser, nullParser];
  for(let i of funcArr){
    let result= i(input);
    //console.log(i, result)
    if (result!== null) return result;
  }
  return null;
}

function objectparser(input){
	if(input[0]!=='{') return null;
	let data=input, output={}, remObj, invalue;
	while(data[0]!=='}'){
		invalue= data.slice(1).replace(/^\s+/, "")
		if(invalue[0]==='}'){               //to check for empty object/array
			remObj= invalue.slice(1);
			return [output, remObj]
		}
		let key= stringParser(invalue);
		//console.log(key, 'key')
		if(key=== null) return null;
		key[1]=key[1].replace(/^\s+/, "")
		if (key[1][0]!==":") return null;
		key[1]=key[1].slice(1).replace(/^\s+/, "")
		let value= valueparser(key[1]);
		//console.log(key[1], value, 'p')
		if (value===null) return null;
		value[1]= value[1].replace(/^\s+/, "")
		//console.log('valw/ospace', value[1][0])
		if (value[1][0]!=="," && value[1][0]!=="}") return null;
		if (value[1][0]==="," && value[1][1]==="}") return null;
		data= value[1];
		output[key[0]] = value[0];
		remObj= value[1]
	}
	//console.log(output,'h');
	return [output, remObj.slice(1)];

}

function arrayparser(input){
  if(input[0]!=='[') return null;
  let data= input, output=[], remAr='';

  while(data[0]!==']'){
    let invalue= data.slice(1).replace(/^\s+/, "");
    //console.log(invalue, data.slice(1))
    if (invalue[0] ===']'){
      remAr= invalue.slice(1)
      return [output, remAr]
    }

    let result= valueparser(invalue);
    if(result=== null) return null;
    //console.log(result, 'abc')
    data= result[1].replace(/^\s+/, "");
    if (data[0]!==',' && data[0]!==']') return null;
    if (data[0]===',' && data[1]===']') return null;
    output= output.concat([result[0]])
    //remAr= result[1];
    remAr= data
  }
  //console.log([output, remAr.slice(1)])
  return [output, remAr.slice(1)]
}

function booleanparser(input){
  if (input.startsWith('true')) return [true, input.slice(4)];
  if (input.startsWith('false')) return [false, input.slice(5)];
  return null
}

function stringParser(input){
	if(input[0]!=='"') return null;
	let output='"',i=1, splObj= { "f":'\f', 'b':'\b', 'r':'\r','t':'\t','n':"\n", '"':'\"' , '\\':'\\', '/':'\/'}; 
	for(i; i<input.length; i++){
		if(input[i]==='\t'||input[i]==='\n') return null
		if(input[i]==='\\' && !("fbrtnu\"\\/").includes(input[i+1])) return null;
		if(input[i]==='\\' && input[i+1] in splObj ){
			//console.log(splObj[input[i+1]],232)
			output+=splObj[input[i+1]];
			i++;
		}else if(input[i]==='\\' && input[i+1]==='u'){
			output+= String.fromCharCode(parseInt(input.slice(i+2,i+6),16));
			i+=5;
		}else{
			output+= input[i];
			if (input[i]==='"') break;
		}
		
	}
	//console.log(input,1, output);
	return [output,input.slice(i+1)];
}

function numparser(input){
  let reg=/\-?\d+(\.\d+)?([eE]?[\+\-]?\d+)?/
  let result= input.match(reg);
  if(result=== null || result.index!==0) return null;
  if(result[0][0]==0 && result[0].length>1) {
  	if(result[0][1]!=='.')return null;
  }
  //console.log('num', result)
  return [Number(result[0]), input.slice(result[0].length)];
}

function nullParser (input) {
  if (!input.startsWith('null')) return null
  return [null, input.slice(4)]
}

