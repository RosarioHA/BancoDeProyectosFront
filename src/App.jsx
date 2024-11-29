import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ApiProvider } from './context/ProjectContext';
import { ProtectedRoute } from './context/ProtectRouter';
import { FormProvider } from './context/FormContext'

const MainLayout = React.lazy(() => import('./layout/mainLayout'));
const Landing = React.lazy(() => import('./views/Landing/landing'));
const Contacto = React.lazy(() => import('./views/Landing/contacto'));
const BancoProyectos = React.lazy(() => import('./views/Projects/bancodeproyectos/bancodeproyectos'));
const BancoIdeas = React.lazy(() => import('./views/Projects/proyectosinnovadores/proyectosInnovadores'));
const Documentacion = React.lazy(() => import('./views/Projects/documentacion/documentacion'));
const Proyecto = React.lazy(() => import('./views/Projects/proyecto/proyecto'));
const DashboardLayout = React.lazy(() => import('./layout/dashboardLayout'));
const ErrorLayout = React.lazy(() => import('./layout/errorLayout'));
const Error404 = React.lazy(() => import('./views/Error/error404'));
const Error500 = React.lazy(() => import('./views/Error/error500'));
const Error503 = React.lazy(() => import('./views/Error/error503'));
const HomeDashboard = React.lazy(() => import('./views/Dashboard/admin/home'));
const CrearProyectos = React.lazy(() => import('./views/Dashboard/gestion_proyectos/creacionDeProyectos/creacionProyectos_pCero'));
const CrearProyecto_paso1 = React.lazy(() => import('./views/Dashboard/gestion_proyectos/creacionDeProyectos/crearProyecto_p1'));
const CrearInnovador_paso1 = React.lazy(() => import('./views/Dashboard/gestion_proyectos/creacionDeProyectos/crearInnovador_p1'));
const AdministrarProyectos = React.lazy(() => import('./views/Dashboard/gestion_proyectos/administracionDeProyectos/administracionProyectos'));
const AdministrarProyectosInnovadores = React.lazy(() => import('./views/Dashboard/gestion_proyectos/administracionDeProyectos/administracionProyectosInnovadores'));
const Success = React.lazy(() => import('./views/Dashboard/gestion_proyectos/creacionDeProyectos/success'));
const SuccessViews = React.lazy(() => import('./views/Dashboard/gestion_proyectos/creacionDeProyectos/success'));
const GestionUsuarios = React.lazy(() => import('./views/Dashboard/admin/GestionUsuarios'));
const EdicionUsuario = React.lazy(() => import('./views/Dashboard/admin/EdicionUsuario'));
const EdicionProfile = React.lazy(() => import('./views/Dashboard/admin/EdicionProfile'));
const SuccessEdicion = React.lazy(() => import('./views/Dashboard/success/Edicion'));
const EditarProyecto = React.lazy(() => import('./views/Dashboard/gestion_proyectos/edicionProjects/editarProyecto'));
const EditarInnovadores = React.lazy(()=> import('./views/Dashboard/gestion_proyectos/edicionProjects/editarInnovadores'))
const TagPriorizados  = React.lazy(() => import('./views/Dashboard/admin/TagPriorizados'));
const Documents = React.lazy(()=>import('./views/Dashboard/admin/Documents')); 
const AddDocuments = React.lazy(()=>import('./views/Dashboard/admin/AddDocuments'));
const EditDocuments = React.lazy(()=>import('./views/Dashboard/admin/EditDocuments'));

const createProtectedRoute = (path, Component, allowedProfiles) => (
  <Route
    path={path}
    element={
      <ProtectedRoute allowedProfiles={allowedProfiles}>
        <Component />
      </ProtectedRoute>
    }
  />
);
function App()
{

  return (
    <ApiProvider>

      <Suspense fallback={
        <div className="d-flex align-items-center flex-column my-5">
          <div className="text-center text-sans-h5-blue">Cargando pagina</div>
          <span className="placeholder col-4 bg-primary">
          </span>
        </div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Landing />} />
            <Route path="bancodeproyectos" element={<BancoProyectos />} />
            <Route path="bancodeideas" element={<BancoIdeas />} />
            <Route path="documentacion" element={<Documentacion />} />
            <Route path="project/:slug" element={<Proyecto />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="error" element={<ErrorLayout />}>
              <Route path="404" element={<Error404 />} />
              <Route path="500" element={<Error500 />} />
              <Route path="503" element={<Error503 />} />
            </Route>
            <Route path="*" element={<Error404 />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedProfiles={[ 'Editor', 'Usuario Formulante' ]}>
                <FormProvider>
                  <DashboardLayout />
                </FormProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<HomeDashboard />} />
            <Route path="crear_proyectos" element={<CrearProyectos />} />
            <Route path="crear_proyecto/:slug" element={<CrearProyecto_paso1 />} />
            <Route path="crear_innovador/:id" element={<CrearInnovador_paso1 />} />
            {createProtectedRoute("administrar_proyectos", AdministrarProyectos, [ 'Editor' ])}
            {createProtectedRoute("administrar_proyectos_innovadores", AdministrarProyectosInnovadores, [ 'Editor' ])}
            <Route path="creacion_exitosa" element={<Success />} />
            {createProtectedRoute("editar_usuario/:id", EdicionUsuario, [ 'Editor' ])}
            <Route path="editar_perfil/:id" element={<EdicionProfile />} />
            <Route path="envio_exitoso" element={<SuccessViews />} />
            {createProtectedRoute("gestion_usuarios", GestionUsuarios, [ 'Editor' ])}
            <Route path="edicion_exitosa" element={<SuccessEdicion />} />
            <Route path="editar_proyecto/:slug" element={<EditarProyecto />} />
            <Route path="edicion_innovador/:id" element={<EditarInnovadores />} />
            <Route path="documentos" element={<Documents />} />
            <Route path="agregar_documento" element={<AddDocuments />} />
            <Route path="editar_documento/:id" element={<EditDocuments />} />
            <Route path="tag_priorizados" element={<TagPriorizados />} />
          </Route>
        </Routes>
      </Suspense>
    </ApiProvider>
  );
}

export default App;