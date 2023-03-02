import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

//servicios 
import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { Facturas } from 'src/app/Interfaces/facturas';

import Swal from 'sweetalert2';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { STRING_TYPE } from '@angular/compiler';


@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})


export class VentaComponent  implements OnInit{
  

  listaProductos: Producto[]=[];
  listaProductosFiltro: Producto[]=[];
  
  listaProductosParaVenta: Facturas[]=[];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!:Producto;
  tipodePagoPorDefecto: string = "Efectivo";
  totalPagar: number =0;

  formularioProductoVenta:FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);


  retornarProductosPorFiltro(busqueda:any):Producto[]{
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase(): busqueda.nombre.toLocaleLowerCase();

    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }
  

  constructor(
    private fb:FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicios:UtilidadService
  ){


    this.formularioProductoVenta = this.fb.group({
      producto: ['',Validators.required],
      cantidad: ['',Validators.required]     
    });

    
    this._productoServicio.lista().subscribe({
      next:(data) => {
        if(data.status){
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stock > 0);
        }
      },
      error:(e) => {}
    })

    //EVENTO para que nos busque productos relacionados con las letras que pongamos en el buscados:
    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    })
      

  }
  ngOnInit(): void {    
  }

  // Evento para mostrar producto seleccionado por medio del campo de busqueda

  mostrarProducto(producto:Producto): string{

    return producto.nombre;
  }

  productoParaVenta (event: any){
    this.productoSeleccionado = event.option.value;    
  }

  agregarProductosParaVenta(){

    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total:number = _cantidad* _precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2))
    })

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

    this.formularioProductoVenta.patchValue({
      producto:'',
      cantidad: ''

    })


  }


}
