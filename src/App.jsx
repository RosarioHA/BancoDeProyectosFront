import React, { Suspense } from 'react';
import { Route, Routes} from 'react-router-dom';
import { ApiProvider } from './context/ProjectContext';

//import PrivateRoute from './components/Commons/privateRoute';
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
const EvaluarInnovadores = React.lazy(() => import('./views/Dashboard/gestion_proyectos/evaluacionDeProyectos/evaluarInnovadores'))
const EvaluarProyecto = React.lazy(() => import('./views/Dashboard/gestion_proyectos/evaluacionDeProyectos/evaluarProyecto'));
const SuccessViews = React.lazy(() => import('./views/Dashboard/gestion_proyectos/creacionDeProyectos/success'));

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
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<HomeDashboard />} />
            <Route path="crearproyectos" element={<CrearProyectos />} />
            <Route path="crearproyecto_paso1" element={<CrearProyecto_paso1 />} />
            <Route path="crearinnovador_paso1" element={<CrearInnovador_paso1 />} />
            <Route path="administrarproyectos" element={<AdministrarProyectos />} />
            <Route path="administrarproyectosinnovadores" element={<AdministrarProyectosInnovadores />} />
            <Route path="success" element={<Success />} />
            <Route path="evaluarinnovadores" element={<EvaluarInnovadores />} />
            <Route path="evaluarproyecto" element={<EvaluarProyecto />} />
            <Route path="envio_exitoso" element={<SuccessViews />} />
          </Route>
        </Routes>
      </Suspense>
    </ApiProvider>
  );
}

export default App;
