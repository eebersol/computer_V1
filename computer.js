///////////////////////////////////////////////////// 	BEGIN MOVING	//////////////////////////////////////////////////////////////////////////
function moveLeft(str) {
	let toMove	= str.split('=')[1];

	toMove 		= toMove.match(this.regexp);
	toMove 		= solveDoubleSign(toMove);
	if (toMove)
	{
		for (let i = 0; i < toMove.length; i++)
		{
			if (toMove[i].length > 1 || Number.isInteger(toMove[i]))
			{
				if (i == 0 && toMove[i][0] != '-' && toMove[i][0] != '+')
					toMove[i]	 = '-' + toMove[i]
				else if (toMove[i][0] == '-' && toMove[i].match(/X/gi) != -1)
				{
					toMove[i] = toMove[i].substr(1, toMove[i].length);
					toMove[i] = '+' + toMove[i]
				}
				else if (toMove[i][0] == '+')
					toMove[i] = '-' + toMove[i].substr(1, toMove[i].length)
			}
		}
		str = str.split('=')[0] + toMove.join('');
	}
	else
	{
		console.log('Syntax error.');
		process.exit() 
	}
	return str;
}
function moveRight() {
	this.result = '';
	for (let i = this.valueTab.length-1; i >= 0; --i)
	{
		this.valueTab[i].number *= this.valueTab[i].number < 0 ? -1 : 1;
		if (this.valueTab[i].sign == '+' && this.valueTab[i].power == null)
			this.valueTab[i].sign = '-';
		else if (this.valueTab[i].sign == '-' && this.valueTab[i].power == null)
			this.valueTab[i].sign = '+';
		else if (this.valueTab[i].sign == '/')
			this.valueTab[i].sign = '*';
		else if ((this.valueTab[i].sign == '*') || this.valueTab[i].power == 1)
			this.valueTab[i].sign = '/' + this.valueTab[i].sign
		this.result += this.valueTab[i].sign + this.valueTab[i].number;
	}
	console.log('The solution is: ');
	console.log(eval(this.result));
}
///////////////////////////////////////////////////// 	END MOVING 	//////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////// 	BEGIN SORT 	//////////////////////////////////////////////////////////////////////////
function simplify() {
	let tmpTab 							= [];

	for (let i = 0; i < this.valueTab.length; i++)
	{
		if (this.valueTab[i+1] && this.valueTab[i].power == this.valueTab[i+1].power && !this.valueTab[i+1].done)
		{
			this.valueTab[i+1].done 	= 1;
			this.valueTab[i+1].number	= this.valueTab[i+1].number > 0 && this.valueTab[i+1].sign 	== '-' ? -parseFloat(this.valueTab[i+1].number) : this.valueTab[i+1].number;
			this.valueTab[i].number 	= this.valueTab[i].number > 0 	&& this.valueTab[i].sign 	== '-' ? -parseFloat(this.valueTab[i].number) : this.valueTab[i].number;
			

			let tmp 					= {};
			tmp.sign 					= this.valueTab[i].number + this.valueTab[i+1].number >= 0 ? '+' : '-';
			tmp.number 					= this.valueTab[i].number + this.valueTab[i+1].number;
			if (tmp.sign == '-' && tmp.number.toString()[0] == '-')
				tmp.number = tmp.number.toString().substr(1, tmp.number.length);
			tmp.power					= this.valueTab[i].power;
			tmpTab.push(tmp);
			i++;
		}
		else if (!this.valueTab[i].done)
			tmpTab.push(this.valueTab[i]);
	}
	this.valueTab 						= tmpTab;
	for (var i=0; i < this.valueTab.length; i++)
	{
		if (this.valueTab[i+1] && this.valueTab[i].power && this.valueTab[i+1].power && this.valueTab[i].power == this.valueTab[i+1].power)
			simplify();
	}
}
function sortByPower() {
	for (let i = 1; i < this.valueTab.length;i++)
	{
		if (this.valueTab[i-1].power < this.valueTab[i].power)
		{
			let tmp 			= this.valueTab[i-1];
			this.valueTab[i-1] 	= this.valueTab[i];
			this.valueTab[i] 	= tmp;
			i = 0;
		}
	}
	this.valueTab.sort((objA, objB) => {return (objA > objB)})
}
function sortByPriority() {
	this.valueTab = [];

	console.log("Equation : ", this.equation)
	for (let i = 0; i < this.equation.length; i++)
	{
		let val 			= this.equation[i].replace(/ /g,'');
		if (val.length > 0)
		{
			this.value 			= {};
			this.value.sign 	= val[0] == '-' ? '-' : '+';
			if (this.value.sign == '-' && val[0] == '-')
				val = val.substr(1, val.length);
			this.value.number 	= isNaN(parseFloat(val)) ? 1 : parseFloat(val);
			this.value.power 	= val.match(/X\^/gi) ? val[val.length-1] : val.match(/X/gi) ? 1 : null;
			this.valueTab.push(this.value);
		}
	}
	sortByPower();
	simplify();
}

///////////////////////////////////////////////////// 	END SORT 		//////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////// 	BEGIN UTILS 	//////////////////////////////////////////////////////////////////////////
function get_polynomial() {
	this.polynomial = 0;

	for (let i = 0; i < this.valueTab.length; i++)
		this.polynomial = this.valueTab[i].power > this.polynomial && this.valueTab[i].number != 0 ? this.valueTab[i].power : this.polynomial; 
}
function ft_sqrt(n, g) {
	if (!g)
		g = n / 2.0;

	let d = n / g;
	let ng = (d + g) / 2.0;

	if (g == ng)
		return g;
	return ft_sqrt(n, ng);
}
function reduceEquation() {
	for (let i = 0; i < this.equation.length; i++)
	{
		this.equation[i] 		= this.equation[i].replace('X^0', '1').replace('X^1', 'X').replace('*X', 'X');
		if (['+', '-'].indexOf(this.equation[i][0]) != -1 && this.equation[i][1] == '0')
			this.equation[i] 	= '';
	}
}
function construcReducedForm(a) {
	this.reducedForm = '';
	for (let i = 0; i < this.valueTab.length; i++)
	{
		if ((this.valueTab[i].number != 0 && this.valueTab[i].power == null) || (this.valueTab[i].number != 0 && this.valueTab[i].power != null))
		{
			this.reducedForm	+= this.valueTab[i].sign 	== '-' 		? '' : this.valueTab[i].sign + ' ';
			this.reducedForm	+= this.valueTab[i].number;
			this.reducedForm	+= this.valueTab[i].power 	!= null 	? 'X^' + this.valueTab[i].power + ' ' : '';
		}
	}
	this.reducedForm 			+= ' = 0';
	this.reducedForm 			= this.reducedForm[0] == '+' ? this.reducedForm.substr(2, this.reducedForm.length) : this.reducedForm
	if (a == 0)
		console.log('Reduced form : ', this.reducedForm + '\n' + 'Polynomial degree: ' + this.polynomial);
}
function solve_polynomial() {
	construcReducedForm(1)
	if (this.reducedForm.split("=")[0] != 0 && this.polynomial == 0)
		return console.log("There is no solution.");
	this.polynomial == 0 	? console.log("All real number are solution.") : construcReducedForm(0);
	this.polynomial == 1 	? moveRight() : 0;
	this.polynomial == 2 	? (calcDelta() > 0 ? deltaPositive() : this.delta  < 0 ? deltaNegative() : deltaZero()) : 0;
	this.polynomial >= 3 	? console.log('The polynomial degree is stricly greater than 2, I can\'t solve.') : 0;
}
///////////////////////////////////////////////////// 		END UTILS 				///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////// 		BEGIN MANAGE DELTA 		///////////////////////////////////////////////////////////////////////////////////
function calcDelta() {
	this.a 		= this.valueTab[0] || {number : 0, sign : '+', power : null};
	this.b 		= this.valueTab[1] || {number : 0, sign : '+', power : null};
	this.c 		= this.valueTab[2] || {number : 0, sign : '+', power : null};
 	this.delta 	= (this.b.number * this.b.number) - (4 * this.a.number * this.c.number);
 	return this.delta;
}
function deltaPositive() {
	console.log('Discriminant is strictly positive, the two solutions are: ')
	this.resultA = (-this.b.number - ft_sqrt(this.delta)) / (2 * this.a.number);
	this.resultB = (-this.b.number + ft_sqrt(this.delta)) / (2 * this.a.number);
	console.log(this.resultA.toFixed(6));
	console.log(this.resultB.toFixed(6));
}
function deltaNegative() {
	console.log('Discriminant is strictly negative, the two solutions are: ');
	console.log('(' + -this.b.number + '-' + 'i√' + this.delta + ')' + '/'  + '(2 * ' + this.a.number + ')')
	console.log('(' + -this.b.number + '+' + 'i√' + this.delta + ')' + '/'  + '(2 * ' + this.a.number + ')')
}
function deltaZero() {
	this.result = -parseFloat(this.b.number) / (2 * parseFloat(this.a.number));
	console.log('The discriminant is null');
	console.log(this.result);
}
function solveDoubleSign(tab)
{
	let tmp = [];

	for (var i = 0; i < tab.length; i++)
	{
		tab[i] = tab[i].trim();
		if (i + 1 != tab.length)
		{
			if (tab[i] == "-" && tab[i].length == 1 && tab[i+1][0] == "-")
				tab[i+1] = tab[i+1].replace("-", "+")
			else if (tab[i].length > 1 || (tab[i] != "+" && tab[i] != "-"))
				tmp.push(tab[i]);
		}
		else
			tmp.push(tab[i]);
	}
	return tmp;
}
///////////////////////////////////////////////////// 	END MANAGE DELTA 	//////////////////////////////////////////////////////////////////////////
function computer() {
	this.regexp = /[+-]?[^+-]+/g

	if (process.argv[2] 
			&& process.argv[2].match(this.regexp) 
				&& process.argv[2].match("="))
	{
		this.equation 	= moveLeft(process.argv[2]).match(this.regexp)
		this.equation = solveDoubleSign(this.equation);
		reduceEquation();
		sortByPriority();
		get_polynomial();
		solve_polynomial();
	}
	return ;
}

computer();
