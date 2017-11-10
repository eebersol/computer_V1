
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

function moveLeft(str)
{
	let toMove = str.split('=')[1];

	toMove = toMove.match(/([+-]?)(?:([^+x-]+)?(?:x(?:\^([\d\/]+))?)|([^+x-]+))/g);
	for (var i =0; i < toMove.length; i++)
	{
		if (i == 0 && toMove[i][0] != '-' && toMove[i][0] != '+')
			toMove[i] = '-' + toMove[i]
		if (toMove[i][0] == '-')
			toMove[i][0] = '+';
		else if (toMove[i][0] == '+')
			toMove[i][0] = '-'
	}
	str = str.split('=')[0] + toMove.join('');
	return (str);
}

function sort_priority_bis(strTab)
{
	for (var i=0; i < strTab.length; i++)
	{
		console.log(strTab[i])
	}
	this.valueTab = [];
	for (var i = 0; i < strTab.length; i++)
	{
		let len = strTab[i].length -1;
		let val = strTab[i]
		this.value = {};
		this.value.sign 	= val[0] == '-' ? '-' : '+';
		this.value.number 	= isNaN(parseInt(strTab[i])) ? 1 : parseInt(val);
		this.value.power 	= val[len-1] == '^' ? parseInt(val[len]) : val[len] == 'X' ? 1 : null
		this.valueTab.push(this.value);
	}
	for (var i = 1; i < this.valueTab.length;i++)
	{
		let len  = this.valueTab.lemgth - 1;
		let cell = this.valueTab[i];
		let cellBefore = this.valueTab[i-1];
		if (this.valueTab[i-1].power < this.valueTab[i].power)
		{
			let tmp = cellBefore;
			this.valueTab[i-1] = cell;
			this.valueTab[i] = tmp;
			i = 0;
		}
	}
	this.valueTab.sort( (objA, objB) => {return (objA > objB)})
	let tmpTab = [];
	for (var i = 0;i < this.valueTab.length; i++)
	{
		if (this.valueTab[i+1] && this.valueTab[i].power == this.valueTab[i+1].power &&  !this.valueTab[i+1].done)
		{
			this.valueTab[i+1].done = 1;
			this.valueTab[i+1].number = this.valueTab[i+1].number > 0 && this.valueTab[i+1].sign == '-' ? -parseInt(this.valueTab[i+1].number) : this.valueTab[i+1].number;
			this.valueTab[i].number = this.valueTab[i].number > 0 && this.valueTab[i].sign == '-' ? -parseInt(this.valueTab[i].number) : this.valueTab[i].number;
			
			let tmp 	= {};
			tmp.sign 	= this.valueTab[i].number + this.valueTab[i+1].number >= 0 ? '+' : '-';
			tmp.number 	= this.valueTab[i].number + this.valueTab[i+1].number;
			tmp.power	= this.valueTab[i].power;
			tmpTab.push(tmp)
		}
		else if (!this.valueTab[i].done)
			tmpTab.push(this.valueTab[i]);
	}
	this.valueTab = tmpTab;
	for (var i = 0; i < this.valueTab.length; i++)
	{
		console.log(this.valueTab[i]);
	}
}

function get_polynomial()
{
	this.polynomial = 0;

	for (var i=0; i < this.valueTab.length; i++)
		this.polynomial = this.valueTab[i].power > this.polynomial && this.valueTab[i].number != 0 ? this.valueTab[i].power : this.polynomial; 
	console.log('Polynomial degree: ', this.polynomial);
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
	if (this.valueTab.length != 3)
		console.log('Error not reduced form');

	this.a = this.valueTab[0]
	this.b = this.valueTab[1]
	this.c = this.valueTab[2]

 	this.delta = (this.b.number * this.b.number)  - (4 * this.a.number * this.c.number)
}

function delta_pos()
{
	console.log('Calcul delta positif')
	console.log((-this.b.number- ft_sqrt(this.delta)))
	console.log((2 * this.a.number))
	this.result = (-this.b.number- ft_sqrt(this.delta)) / (2 * this.a.number)
	console.log(this.result.toFixed(6));
	this.result = (-this.b.number + ft_sqrt(this.delta)) / (2 * this.a.number)
	console.log(this.result.toFixed(6));
}

function delta_neg()
{
	console.log('Delta is negative, can\'t solve');
}

function delta_zero()
{
	let a 		= parseFloat(this.equation.a)
	let b		= parseFloat(this.equation.b)
	console.log(a, b)
	this.result = -b/(2*a);
	console.log(this.result);
}

function move_right()
{
	this.result = '';
	for (var i = this.valueTab.length-1; i > 0; i--)
	{
		if (this.valueTab[i].sign == '+' && this.valueTab[i].power == null)
			this.valueTab[i].sign = '-';
		else if (this.valueTab[i].sign == '-')
			this.valueTab[i].sign = '+';
		else if (this.valueTab[i].sign == '/')
			this.valueTab[i].sign = '*';
		else if ((this.valueTab[i].sign == '*') || this.valueTab[i].power == 1)
			this.valueTab[i].sign = '/'
		else
			console.log('toto')
		this.result += this.valueTab[i].sign + this.valueTab[i].number;
	}
}
function getReduceForm()
{
	this.basicSign 			= ['+', '-'];
	this.equation 			= {};
	this.equation.complet 	= process.argv[2];
	this.equation.complet 	= this.equation.complet.split(' ');
	this.equation.complet 	= this.equation.complet.join('');
	this.equation.complet = moveLeft(this.equation.complet).match(/([+-]?)(?:([^+x-]+)?(?:x(?:\^([\d\/]+))?)|([^+x-]+))/g)
	console.log('After all move : ', this.equation.complet)
	this.equation.complet 	= reduce_x(this.equation.complet);
	this.equation.complet 	= sort_priority_bis(this.equation.complet);
	get_polynomial(this.equation.complet)
	calc_delta();
	if (this.polynomial > 2)
			return console.log('The polynomial degree is stricly greater than 2, I can\'t solve.');
	else if (this.polynomial == 2)
		this.delta > 0 ? delta_pos() : this.equation.delta  < 0 ? delta_neg() : delta_zero();
	else if (this.polynomial == 1)
	{
		move_right();
		console.log('The solution is: \n', eval(this.result));
	}
}

getReduceForm();


// Étape 5 : Remplace aa, bb et ΔΔ par leurs valeurs dans les deux formules −b−Δ‾‾√2a−b−Δ2a et −b+Δ‾‾√2a−b+Δ2a.
// Étape 6 : Calcule. Les deux résultats obtenus sont les solutions de l'équation.

