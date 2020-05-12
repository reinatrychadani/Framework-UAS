import React from "react";

const ListBuku = (props) => {
	return (
		<div class="container">
			<table class="table table-striped">
				<tbody>
					<tr>
						<td>{props.judul}</td>
						<td>{props.jenis}</td>
						<td>{props.deskripsi}</td>
						<td>{props.penulis}</td>
						<td>
							<button className="btn btn-sm btn-warning"
								onClick={() => {
									if (window.confirm('Apakah anda yakin menghapus buku ini?'))
										props.hapusBuku(props.idBuku)}} >
							Hapus
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

export default ListBuku;