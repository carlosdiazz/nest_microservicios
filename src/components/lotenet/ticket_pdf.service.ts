import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import { Injectable } from '@nestjs/common';

//Propio
import { Jugada, TicketData } from './interfaces/ticketdata.interface';

@Injectable()
export class TicketPdfService {
  async saberSiExiste(ticket: TicketData): Promise<string | null> {
    const rutaCarpeta = path.join(__dirname, '..', '..', 'pdf_ticket');
    const nombreArchivo = `${ticket.serialkey}.pdf`;
    const rutaCompleta = path.join(rutaCarpeta, nombreArchivo);

    try {
      if (fs.existsSync(rutaCompleta)) {
        return rutaCompleta;
      } else {
        return null;
      }
    } catch (e) {
      console.log(`Paso un error en sabersiExiste: ${e}`);
      return null;
    }
  }

  formartFecha(fecha: string): string {
    const newFecha = new Date(fecha);
    return `${newFecha.toLocaleDateString()}`;
  }

  altutaTicket(jugadas: number) {
    return 200 + jugadas * 15;
  }

  agregarEspacio(numero: string): string {
    const espacio = 25 - numero.length;
    const espacio_adicional = numero.split(' ');
    return ' '.repeat(espacio * 2 + espacio_adicional.length - 1);
  }

  jugadasEnTicket(doc: PDFKit.PDFDocument, arrJugadas: Jugada[]) {
    for (const jugada of arrJugadas) {
      doc
        .fontSize(12)
        .text(
          `     ${jugada.numero}${this.agregarEspacio(jugada.numero)}$${jugada.monto}`,
          {
            align: 'left',
          },
        );
    }
  }

  async buildTicketPDF(ticket: TicketData) {
    const alturaTicket = this.altutaTicket(ticket.jugadas.length);
    const doc = new PDFDocument({ size: [300, alturaTicket], margin: 20 });
    const rutaCarpeta = path.join(__dirname, '..', '..', 'pdf_ticket');
    const nombreArchivo = `${ticket.serialkey}.pdf`;
    const rutaCompleta = path.join(rutaCarpeta, nombreArchivo);
    try {
      if (await this.saberSiExiste(ticket)) {
        return;
      }
      // Verificar si la carpeta existe, si no, crearla
      if (!fs.existsSync(rutaCarpeta)) {
        fs.mkdirSync(rutaCarpeta, { recursive: true });
      }
    } catch (e) {
      console.log(`Error creando direccion del ticket : ${e}`);
    }
    //console.log(`Creando Ticket PDF ${ticket.serialkey}`);
    // Crear el archivo PDF
    doc.pipe(fs.createWriteStream(rutaCompleta));

    // Agregar contenido al PDF
    if (ticket.consorcio_nombre) {
      doc.fontSize(16).text(`${ticket.consorcio_nombre}`, { align: 'center' });
    }

    if (ticket.sorteo_nombre) {
      doc
        .fontSize(12)
        .text(`Sorteo: ${ticket.sorteo_nombre}`, { align: 'center' });
    }

    if (ticket.created_at) {
      doc.fontSize(12).text(`Fecha: ${this.formartFecha(ticket.created_at)}`, {
        align: 'center',
      });
    }
    if (ticket.serialkey) {
      doc.fontSize(12).text(`Serial: ${ticket.serialkey}`, { align: 'center' });
    }
    if (ticket.contacto) {
      doc
        .fontSize(12)
        .text(`Contacto: ${ticket.contacto}`, { align: 'center' });
    }
    doc
      .fontSize(14)
      .text(`------------------------------------------------------`, {
        align: 'center',
      });
    this.jugadasEnTicket(doc, ticket.jugadas);
    doc
      .fontSize(14)
      .text(`------------------------------------------------------`, {
        align: 'center',
      });
    doc.fontSize(12).text(`Total: $${ticket.monto_jugado}`, {
      align: 'center',
    });
    doc.fontSize(12).text(`Vendido por: ${ticket.id}`, {
      align: 'center',
    });
    if (ticket.fecha_caduca) {
      doc.fontSize(12).text(`Caduca: ${ticket.fecha_caduca}`, {
        align: 'center',
      });
    }
    if (ticket.consorcio_pie) {
      doc.fontSize(12).text(`${ticket.consorcio_pie}`, {
        align: 'center',
      });
    }
    doc.end();
  }
}
