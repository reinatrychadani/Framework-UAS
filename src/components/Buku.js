import React, { Component } from "react";
import ListBuku from "../components/ListBuku";
import firebase from "firebase";
import firebaseConfig from "../firebase/config";

class Buku extends Component {
	constructor(props) {
		super(props);
		firebase.initializeApp(firebaseConfig); //inisialisasi konfigurasi firebase

		this.state = {
			listBuku: []
		}
	}

	ambilDataDariServerAPI = () => { 
		let ref = firebase.database().ref("/");
		ref.on("value", snapshot => {
			const state = snapshot.val();
			this.setState(state);
		});
	}

	simpanDataKeServerAPI = () => { 
		firebase.database()
			.ref("/")
			.set(this.state);
	}

	componentDidMount() { 
		this.ambilDataDariServerAPI() 
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState !== this.state) {
			this.simpanDataKeServerAPI();
		}
	}

	handleHapusBuku = (idBuku) => { 
		const { listBuku } = this.state;
		const newState = listBuku.filter(data => {
			return data.uid !== idBuku;
		});
		this.setState({ listBuku: newState });
	}

	handleTambahBuku = (event) => { 
		let formInsertBuku = {...this.state.insertBuku}; 
		let timestamp = new Date().getTime(); //untuk menyimpan waktu (sebagai ID buku)
		formInsertBuku['id'] = timestamp;
		formInsertBuku[event.target.name] = event.target.value; //menyimpan data onchange ke formInsertBuku sesuai dengan target yang diisi
		this.setState ({
			insertBuku: formInsertBuku
		});
	}

	handleTombolSimpan = (event) => { 
		let title = this.refs.judulBuku.value;
		let type = this.refs.jenisBuku.value;
		let body = this.refs.deskripsiBuku.value;
		let author = this.refs.penulisBuku.value;
		let uid = this.refs.uid.value;

		if (uid && type && author && title && body) { 
			const { listBuku } = this.state;
			const indeksBuku = listBuku.findIndex(data => {
				return data.uid === uid;
			})
			listBuku[indeksBuku].type = type;
			listBuku[indeksBuku].author = author;
			listBuku[indeksBuku].title = title;
			listBuku[indeksBuku].body = body;
			this.setState({ listBuku });
		} else if (type && author && title && body) { 
			const uid = new Date().getTime().toString();
			const { listBuku } = this.state;
			listBuku.push({ uid, type, author, title, body });
			this.setState({ listBuku });
		}
		this.refs.judulBuku.value = "";
		this.refs.jenisBuku.value = "";
		this.refs.deskripsiBuku.value = "";
		this.refs.penulisBuku.value = "";
		this.refs.uid.value = "";
	}

	render() {
		return (
			<div className="post-buku">
				<div className="form pb-2 border-bottom">
					<div>
						<h1 className="title">Dunia Buku</h1>
					</div>
					<div className="form-group row">
						<label htmlFor="title" className="col-sm-2 col-form-label">
							Judul Buku
						</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" id="title" name="title"
							ref="judulBuku" onchange={this.handleTambahBuku} />
						</div>
					</div>
					<div className="form-group row">
						<label htmlFor="type" className="col-sm-2 col-form-label">
							Jenis Buku 
						</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" id="type" name="type"
							ref="jenisBuku" onchange={this.handleTambahBuku} />
						</div>
					</div>
					<div className="form-group row">
						<label htmlFor="body" className="col-sm-2 col-form-label">
							Deskripsi Buku 
						</label>
						<textarea className="form-control" id="body" name="body" rows="4"
						ref="deskripsiBuku" onchange={this.handleTambahBuku}></textarea>
					</div>
					<div className="form-group row">
						<label htmlFor="author" className="col-sm-2 col-form-label">
							Penulis Buku 
						</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" id="author" name="author"
							ref="penulisBuku" onchange={this.handleTambahBuku} />
						</div>
					</div>
					<input type="hidden" name="uid" ref="uid" />
					<button type="submit" className="btn btn-primary" onClick={this.handleTombolSimpan}>
						Add Buku 
					</button>
				</div>

				<div />
				<h2>List Buku</h2>
				<table class="table table-striped">
					<thead>
						<tr>
							<th>Judul Buku</th>
							<th>Jenis Buku</th>
							<th>Deskripsi Buku</th>
							<th>Penulis Buku</th>
							<th>Action</th>
						</tr>
					</thead>
				</table>

				{
					this.state.listBuku.map(buku => { 
						return <ListBuku key={buku.uid} judul={buku.title} jenis={buku.type} deskripsi={buku.body}
						penulis={buku.author} idBuku={buku.uid} hapusBuku={this.handleHapusBuku} /> 
					})
				}

			</div>
		)
	}
}

export default Buku;