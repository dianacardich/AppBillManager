import { Component,OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';

// Servicios
import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';



@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  //poder editar, crear usuario
   formularioUsuario: FormGroup;
   ocultarPassword: boolean = true;
   tituloAccion:string ="Agregar";
   botonAccion:string = "Guardar";
   listaRoles: Rol[] = [];

  constructor( //inyectamos las dependencias
    private modalActual:MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA)public datosUsuario: Usuario,
    private fb:FormBuilder,
    private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {
    //declaramos los campos de nuestro formulario

    this.formularioUsuario = this.fb.group ({
      nombreCompleto: ['', Validators.required],
      correo: ['', Validators.required],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['', Validators.required]
    });

    if(this.datosUsuario != null){
      this.tituloAccion = "Editar";
      this.botonAccion =  "Actualizar";
    }

      this._rolServicio.lista().subscribe({
        next:(data) => {
          if(data.status) this.listaRoles = data.value
        },

        error:(e) => {}
      })


  }
  // Este metodo se ejecuta cuando el componente ya se está cargando
  ngOnInit(): void { 
    if(this.datosUsuario != null){

      this.formularioUsuario.patchValue({
        nombreCompleto:this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString()
      })
    }   
  }
//Metodo para crear, editar un usuario

guardarEditar_Usuario(){
  const _usuario: Usuario = {
    idUsuario: this.datosUsuario == null? 0:this.datosUsuario.idUsuario,
    nombreCompleto: this.formularioUsuario
  }
}



}


throw new Error('Method not implemented.');