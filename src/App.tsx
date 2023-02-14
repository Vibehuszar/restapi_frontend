import { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';


interface State{
  konyvek: Konyv[];
  szerzo: string;
  cim: string;
  hossz: number
}

interface Konyv{
  id: number;
  szerzo: string;
  cim: string;
  hossz: number;
}


class App extends Component<{}, State>{

  constructor(props: {}){
    super(props);

    this.state = {
      szerzo: "",
      cim: "",
      hossz: 0,
      konyvek: [],
    }
  }

  async loadKonyvek() {
    let respone = await fetch('http://localhost:3000/konyv');
    let data = await respone.json() as Konyv[];
    this.setState({
      konyvek: data
    })
  }

  componentDidMount() {
    this.loadKonyvek();
  }

  handleUpload = async () => {
    const { szerzo, cim, hossz } = this.state;
    if(szerzo.trim() === '' || cim.trim() === '' || hossz <1){
      // this.setState()- tel hibaüzenet megjelenítése
      return;
    }

    const adat = {
      szerzo: szerzo,
      cim: cim,
      hossz: hossz,
    }

    let response = await fetch('http://localhost:3000/konyv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adat),
    });

    this.setState({ 
      szerzo: '',
      cim: '',
      hossz: 0,
    })

    await this.loadKonyvek();
  };

  async handleDelete(id: number) {
    let respone = await fetch('http://localhost:3000/konyv/ '+ id,{
      method: 'DELETE',
    }
    
    
    )
    await this.loadKonyvek();
  }


render() {
  return <div className='container-fluid'>
    <h2>Könyvek</h2>

    Szerző: <input type="text" value={this.state.szerzo} onChange={e => this.setState({ szerzo: e.currentTarget.value})}/><br />
    Cím: <input type="text" value={this.state.cim} onChange={e => this.setState({ cim: e.currentTarget.value})} /><br />
    Hossz: <input type="number" value={this.state.hossz} onChange={e => this.setState({ hossz: parseInt(e.currentTarget.value)})}/><br />
    <button onClick={this.handleUpload}>Hozzáad</button> <br />
    <table>
    <tr>
            <th>Szerző</th>
            <th>Cím</th>
            <th>Hossz</th>
          </tr>
    </table>
    {
      this.state.konyvek.map(konyv =>
        <table> 
          <tr>
            <td>{konyv.szerzo}</td>
            <td>{konyv.cim}</td>
            <td>{konyv.hossz}</td>
            <td><button onClick={() => this.handleDelete(konyv.id)}>Törlés</button></td>
          </tr>
        </table>
        )
      }
      
  </div>
}
}

export default App;
