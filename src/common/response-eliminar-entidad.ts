import { MESSAGE } from './../config/message';
import { ResponsePropioGQl } from './response.gql';

export const responseEliminarEntidad = (
  response: number,
): ResponsePropioGQl => {
  if (response === 0) {
    return {
      error: true,
      message: MESSAGE.NO_SE_PUDO_ELIMINAR_ESTA_ENTIDAD,
    };
  }
  return {
    error: false,
    message: MESSAGE.SE_ELIMINO_CORRECTAMENTE_ESTA_ENTIDAD,
  };
};
