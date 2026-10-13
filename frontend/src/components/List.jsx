
function List(){

    const fruits = [{name: "Apple", calories: 95}, {name: "Orange", calories: 125}, {name: "Cherry", calories: 55}]

    fruits.sort((a, b) => a.name.localeCompare(b.name))

    // const lowCalFruits = fruits.filter(fruit => fruit.calories < 100);
    // const highCalFruits = fruits.filter(fruit => fruit.calories > 100);

    const listItems = fruits.map(fruit => <li key={fruit.name}> {fruit.name} <br /> Calories: {fruit.calories}</li>);

    return(<ol>{listItems}</ol>);
}

export default List