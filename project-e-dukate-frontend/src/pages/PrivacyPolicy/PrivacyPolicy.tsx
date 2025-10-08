"use client";

import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';

const PrivacyPolicy: React.FC = () => {
  const { setIsNavigating } = useSafeNavigation();
  
  useEffect(() => {
    setIsNavigating(false);
  }, [setIsNavigating]);

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom>
          Políticas de Privacidad
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Última actualización: 26 de agosto de 2025
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography sx={{ fontWeight: "bold" }} variant="h6" gutterBottom>
          1. Introducción
        </Typography>
        <Typography component="div" sx={{ mb: 2 }}>
          En E-Dukate el Centro de Atención, Evaluación e Intervención en Trastornos del Neurodesarrollo y Salud Mental, dirigido por la Mgr. Lourdes Tupa Lima, Master en Discapacidad y Certificada para Diagnóstico de Autismo, nos comprometemos a proteger la privacidad de nuestros pacientes y sus familias. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información personal.
        </Typography>

        <Typography sx={{ fontWeight: "bold" }} variant="h6" gutterBottom>
          2. Información que Recopilamos
        </Typography>
        <Typography component="div" sx={{ mb: 2 }}>
          Recopilamos los siguientes tipos de información:
          <ul>
            <li><strong>Datos personales:</strong> Nombre, número de teléfono, correo electrónico, dirección y, en su caso, datos de tutores legales.</li>
            <li><strong>Datos médicos:</strong> Historial clínico, diagnósticos, informes de evaluación (por ejemplo, relacionados con autismo u otros trastornos) y registros de citas.</li>
            <li><strong>Datos de menores:</strong> Información proporcionada por padres o tutores legales para tratamientos en psicología, fonoaudiología, fisioterapia, nutrición u otros servicios.</li>
          </ul>
        </Typography>

        <Typography sx={{ fontWeight: "bold" }} variant="h6" gutterBottom>
          3. Cómo Usamos tu Información
        </Typography>
        <Typography component="div" sx={{ mb: 2 }}>
          Utilizamos tus datos para:
          <ul>
            <li>Coordinar citas y proporcionar servicios de psicología, fonoaudiología, fisioterapia, nutrición y otros.</li>
            <li>Realizar evaluaciones y diagnósticos, como los relacionados con trastornos del neurodesarrollo.</li>
            <li>Contactarte para recordatorios de citas o seguimientos.</li>
            <li>Cumplir con obligaciones legales o normativas de salud en Bolivia.</li>
          </ul>
        </Typography>

        <Typography sx={{ fontWeight: "bold" }} variant="h6" gutterBottom>
          4. Compartir tu Información
        </Typography>
        <Typography component="div" sx={{ mb: 2 }}>
          No compartimos tus datos personales con terceros, salvo en los siguientes casos:
          <ul>
            <li>Con especialistas externos (por ejemplo, laboratorios o médicos referidos), previa autorización del paciente o tutor legal.</li>
            <li>Con autoridades legales, if así lo exige la normativa boliviana.</li>
          </ul>
        </Typography>

        <Typography sx={{ fontWeight: "bold" }} variant="h6" gutterBottom>
          5. Seguridad de los Datos
        </Typography>
        <Typography component="div" sx={{ mb: 2 }}>
          Implementamos medidas de seguridad físicas y digitales, como almacenamiento seguro de expedientes médicos y acceso restringido a datos, para proteger tu información. Nos aseguramos de cumplir con las normativas de confidencialidad en el ámbito de la salud.
        </Typography>

        <Typography sx={{ fontWeight: "bold" }} variant="h6" gutterBottom>
          6. Tus Derechos
        </Typography>
        <Typography component="div" sx={{ mb: 2 }}>
          De acuerdo con la normativa boliviana, tienes derecho a:
          <ul>
            <li>Acceder a tus datos personales o los de tu hijo/a bajo tu tutela.</li>
            <li>Solicitar la corrección o eliminación de datos inexactos.</li>
            <li>Retirar tu consentimiento para el uso de datos, salvo en casos requeridos por ley.</li>
          </ul>
          Para ejercer estos derechos, contáctanos en los datos proporcionados en la sección de contacto.
        </Typography>

        <Typography sx={{ fontWeight: "bold" }} variant="h6" gutterBottom>
          7. Cambios a esta Política
        </Typography>
        <Typography component="div" sx={{ mb: 2 }}>
          Podemos actualizar esta política periódicamente. Cualquier cambio será comunicado en nuestro sitio web o directamente a los pacientes, si es necesario.
        </Typography>

        <Typography sx={{ fontWeight: "bold" }} variant="h6" gutterBottom>
          8. Contacto
        </Typography>
        <Typography component="div" sx={{ mb: 2 }}>
          Si tienes preguntas sobre esta Política de Privacidad, contáctanos en:
          <ul>
            <li><strong>Teléfono:</strong> +591 76440737</li>
            <li><strong>Dirección:</strong> Calle Potosí, entre Uyuni y pasaje 1 de Abril, Cochabamba, Bolivia</li>
          </ul>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          © 2025 Centro de Atención, Evaluación e Intervención en Trastornos del Neurodesarrollo y Salud Mental. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;