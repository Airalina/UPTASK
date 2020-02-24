<?php

function usuario_autenticado()
{
    if(!revisar_usuario()){
        header('Location:login.php');
        exit();
    }
}

function revisar_usuario()
{
        return isset($_SESSION['nombre']);
}
session_start(); //ir de una pagina a otra sin loguearte a cada rato
usuario_autenticado();