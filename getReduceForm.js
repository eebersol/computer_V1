
function reduce_x(strTab)
{
	for (var i=0; i < strTab.length; i++)
	{
		strTab[i] = strTab[i].replace('X^0', '1').replace('X^1', 'X').replace('*X', 'X')
		if (this.basicSign.indexOf(strTab[i][0]) != -1 && strTab[i][1] == '0')
			strTab[i] = '';
	}
	return (strTab);
}

function basicCalc(strTab)
{
	let calc = [];
	let unknow = [];
	for (var i = 0; i < strTab.length; i++)
	{
		if (strTab[i].search('X') == -1)
			calc.push(strTab[i]);
		else
			unknow.push(strTab[i])
	}
	calc = eval(calc.join(''))
	calc = calc >= 0 ? '+' + calc : '-' + calc; 
	unknow.push(calc)
	return (unknow)
}

function moveLeft(str)
{
	let toMove = str.split('=')[1];

	toMove = toMove.match(/([+-]?)(?:([^+x-]+)?(?:x(?:\^([\d\/]+))?)|([^+x-]+))/g);
	for (var i =0; i < toMove.length; i++)
	{
		if (i == 0 && toMove[i][0] != '-' && toMove[i][0] != '+')
			toMove[i] = '-' + toMove[i][0]
		if (toMove[i][0] == '-')
			toMove[i][0] = '+';
		else if (toMove[i][0] == '+')
			toMovep[i][0] = '-'
	}
	str = str.split('=')[0] + toMove.join('');
	return (str);
}

function sort_priority(strTab)
{
	let arr1 		= [];
	let arr2 		= [];
	let arr3 		= [];
	let finalArray 	= [];

	arr1 = strTab.filter((str) => {
		if (str.search(/X\^/i) != -1)
		{
			console.log(isNaN(parseInt(str)) ? 1 : parseInt(str))
			console.log(arr1)
			return isNaN(parseInt(str)) ? '1' : parseInt(str)
		}
	})
	arr2 = strTab.filter((str) => {
		if (str[str.length-1] == 'X')
		{
			str = isNaN(parseInt(str)) == NaN ? 1 : parseInt(str)
		}
	})
	arr3 = strTab.filter((str) => {
		if (str.search('X') == -1)
		{

			str = isNaN(parseInt(str)) == NaN ? 1 : parseInt(str)
		}
	})
	console.log('ic' ,arr1)
	finalArray.push(arr1.reduce(function(pv, cv) { return pv + cv; }, 0) + 'X^2');
	finalArray.push(arr2.reduce(function(pv, cv) { return pv + cv; }, 0) + 'X');
	finalArray.push(arr3.reduce(function(pv, cv) { return pv + cv; }, 0));
	console.log(finalArray)
	return (finalArray);
}

function sort_priority_bis(strTab)
{
	this.value = {};
	this.valueTab = [];

	for (var i = 0; i < strTab.length; i++)
	{
		this.value.sign 	= strTab[i][0] == '-' ? '-' : '+';
		this.value.number 	= isNaN(parseInt(strTab[i][0])) ? 1 : parseInt(strTab[i]);
		this.value.power 	= strTab[i].search(/(?:X\^([0-9]|\d\d+))/) != -1 ? strTab[i].substr(strTab[i].search(/(?:X\^([0-9]|\d\d+))/), strTab[i].length) : null;
		this.valueTab.push(this.value);
	}
}

function get_polynomial(strTab)
{
	let flag;

	for (var i=0; i < strTab.length; i++)
	{
		if (strTab[i].search(/X\^/) != -1)
			flag = flag > strTab[i][strTab[i].search(/X\^/)+2] ? flag : strTab[i][strTab[i].search(/X\^/)+2];
	}
	console.log('Polynomial degree: ', flag);
}

function check_solve(strTab)
{
	let flag;

	flag = 0;
	console.log('Reduced form : ' + strTab.join(' '));
	get_polynomial(strTab);
	for(var i=0; i < strTab.length; i++)
	{
		if (strTab[i].search(/(?:X\^([3-9]|\d\d+))/g) != -1)
			flag++;
	}
	flag == 0 ? 0 : console.log('The polynomial degree is stricly greater than 2, I can\'t solve.')
	return (flag);
}

function get_a_b_c(str, char)
{
	this.equation[char] = '';
	for (var i=0; i < str.length; i++)
	{
		if ((str[i] == '+' || str[i] == '-') &&  str[i=1] == 'X')
			this.equation[char] = '1';
		else if (!str[i] || str[i] == 'X')
			break;
		else if (str[i] != '+')
			this.equation[char] += str[i];
	}
}

function ft_sqrt(n, g) {
    if (!g) {
        g = n / 2.0;
    }
    var d = n / g;
    var ng = (d + g) / 2.0;
    if (g == ng) {          
        return g;
    }
    return ft_sqrt(n, ng);
}

function calc_delta()
{
 	this.equation.delta = (this.equation.b * this.equation.b)  - (4 * this.equation.a * this.equation.c)
}

function delta_pos()
{
	let a 		= parseFloat(this.equation.a)
	let b		= parseFloat(this.equation.b)
	let delta 	= parseFloat(this.equation.delta)

	console.log('a : ', a, '\nb : ', b, '\nDelta :', ft_sqrt(delta))
	this.result = (-b - ft_sqrt(delta)) / (2 * a)
	console.log(this.result.toFixed(6));
	this.result = (-b + ft_sqrt(delta)) / (2 * a)
	console.log(this.result.toFixed(6));
}

function delta_neg()
{
	console.log('Delta is negative, can\'t solve');
}

function delta_zero()
{
	console.log('ici')
	let a 		= parseFloat(this.equation.a)
	let b		= parseFloat(this.equation.b)
	console.log(a, b)
	this.result = -b/(2*a);
	console.log(this.result);
}

function getReduceForm()
{
	this.basicSign 			= ['+', '-'];
	this.equation 			= {};
	this.equation.complet 	= process.argv[2];
	this.equation.complet 	= this.equation.complet.split(' ');
	this.equation.complet 	= this.equation.complet.join('');
	this.equation.complet 	= reduce_x(moveLeft(this.equation.complet).match(/([+-]?)(?:([^+x-]+)?(?:x(?:\^([\d\/]+))?)|([^+x-]+))/g));
	this.equation.complet 	= sort_priority_bis(this.equation.complet);
	this.equation.complet 	= basicCalc(this.equation.complet);
	if (check_solve(this.equation.complet) != 0)
		return ;
	get_a_b_c(this.equation.complet[0], 'a');
	get_a_b_c(this.equation.complet[1], 'b');
	get_a_b_c(this.equation.complet[2], 'c');
	calc_delta();
	this.equation.delta > 0 ? delta_pos() : this.equation.delta  < 0 ? delta_neg() : delta_zero();
}

getReduceForm();


// Étape 5 : Remplace aa, bb et ΔΔ par leurs valeurs dans les deux formules −b−Δ‾‾√2a−b−Δ2a et −b+Δ‾‾√2a−b+Δ2a.
// Étape 6 : Calcule. Les deux résultats obtenus sont les solutions de l'équation.

