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
  return <div className='fodiv container'>
    <h2 className='display-2'>Könyvek</h2>

    <div className='form-group'>
      <label htmlFor="">Szerző:</label>
      <input type="text" className='form-control' value={this.state.szerzo} onChange={e => this.setState({ szerzo: e.currentTarget.value})}/><br />
      <label htmlFor="">Cím:</label>
      <input type="text" className='form-control' value={this.state.cim} onChange={e => this.setState({ cim: e.currentTarget.value})} /><br />
      <label htmlFor="">Hossz: </label>
      <input type="number" className='form-control' value={this.state.hossz} onChange={e => this.setState({ hossz: parseInt(e.currentTarget.value)})}/><br />
      <button className='btn btn-outline-primary' onClick={this.handleUpload}>Hozzáad</button> <br />
    </div>
    
  
    <table className='table table-hover'>
      <thead>
          <tr>
          <th scope="col">id</th>
            <th scope='col'>Szerző</th>
            <th scope='col'>Cím</th>
            <th scope='col'>Hossz(oldal)</th>
          </tr>
      </thead>
    <tbody>
    {
      this.state.konyvek.map(konyv =>
        
          <tr>
            <th scope="row">{konyv.id}</th>
            <td>{konyv.szerzo}</td>
            <td>{konyv.cim}</td>
            <td>{konyv.hossz}</td>
            <td><button onClick={() => this.handleDelete(konyv.id)}>Törlés</button></td>
          </tr>
        
        )
      }
    </tbody>
    
    </table>
    
      
  </div>
}
}

export default App;
