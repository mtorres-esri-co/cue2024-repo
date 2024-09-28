/* eslint-disable @typescript-eslint/naming-convention */
import { React } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { SettingSection, MapWidgetSelector } from 'jimu-ui/advanced/setting-components'
// import { JimuLayerViewSelectorDropdown } from 'jimu-ui/advanced/setting-components'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { type IMConfig } from '../config'

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const __tituloCapaDestino = props.config.featureLayerDestino.titulo
  const __intersecciones = props.config.featureLayerDestino.intersecciones

  console.log('props.config')
  console.log(props.config)

  let pointFeatureLayers = []
  let polygonFeatureLayers = []
  let map = null

  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: useMapWidgetIds
    })
  }

  const onActiveViewChanged = (jmv: JimuMapView) => {
    console.log(jmv)

    if (jmv) {
      map = jmv.view.map
      const layerViews = jmv.jimuLayerViews

      for (const key in layerViews) {
        if (layerViews[key].id === __tituloCapaDestino || layerViews[key].layer.title === __tituloCapaDestino) {
          console.log(__tituloCapaDestino)
        }
      }
    } else {
      map = undefined
    }
    console.log('map')
    console.log(map)
    fillLayerList()
    setValues()
  }

  const fillLayerList = () => {
    console.log('fillLayerList')
    console.log(map)
    if (map !== undefined) {
      pointFeatureLayers = map.layers.filter(layer => {
        return layer.type === 'feature' && layer.geometryType === 'point'
      })
      polygonFeatureLayers = map.layers.filter(layer => {
        return layer.type === 'feature' && layer.geometryType === 'polygon'
      })
    }
    console.log('pointFeatureLayers')
    console.log(pointFeatureLayers.length)
    console.log('polygonFeatureLayers')
    console.log(polygonFeatureLayers.length)
  }

  const setValues = () => {
    console.log('setValues')
    const pointLayerOptions = []
    const polygonLayerOptions = []

    pointFeatureLayers.forEach(layer => {
      pointLayerOptions.push({ label: layer.title, value: layer.title })
    })
    polygonFeatureLayers.forEach(layer => {
      polygonLayerOptions.push({ label: layer.title, value: layer.title })
    })

    console.log(pointLayerOptions)
    console.log(polygonLayerOptions)

    if (__intersecciones.length > 0) {
      _setIntersecciones()
    }
  }

  const _setIntersecciones = () => {
    console.log('_setIntersecciones')
    const interseccionesOptions = []
    __intersecciones.forEach(item => {
      interseccionesOptions.push({ value: item.nombre, label: item.nombre })
    })
  }

  // const __capaDestinoLayerViewSelector = <JimuLayerViewSelectorDropdown
  //     isMultiSelection={false}
  //     jimuMapViewId={mapViewId}
  //     defaultSelectedValues={[capasDestinoSelectValue]}
  //     hideLayers={_capasDestinoHideLayers}
  //     onChange={(s) => { _setCapaDestino(s) }}
  //   />

  // const __campoFechaFieldSelect = <FieldSelector
  //     isMultiple = {false}
  //     useDropdown = {true}
  //     types = {Immutable([JimuFieldType.Date])}
  //   />

  // const __addInterseccionButton = <Button id = "addInterseccionButton"
  //   className="jimu-btn"
  //   onClick={_addInterseccion}>Agregar</Button>

  // const __deleteInterseccionButton = <Button id = "addInterseccionButton"
  //   className="jimu-btn"
  //   onClick={_deleteInterseccion}>Eliminar</Button>

  return (
    <div>
      <div className="jimu-widget jimu-widget-ubicacioncoordenadas-setting" id="mainDiv">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={onActiveViewChanged} />
        )}
        <SettingSection title="Mapa">
          <MapWidgetSelector
              useMapWidgetIds={props.useMapWidgetIds}
              onSelect={onMapWidgetSelected}
          />
        </SettingSection>
        <SettingSection title="Capa Destino">
        <br />
        <table style={{ width: '100%' }}>
        {/*
          <tr>
            <td className="etiqueta">
              <label htmlFor="capaDestinoSelect">Capa:</label>
            </td>
            <td className="lista">
              {__capaDestinoLayerViewSelector}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="campoFechaSelect">Campo Fecha:</label>
            </td>
            <td className="lista">
              {__campoFechaFieldSelect}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="campoLatitudSelect">Campo Latitud:</label>
            </td>
            <td className="lista">
              {__campoLatitudSelect}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="campoLongitudSelect">Campo Longitud:</label>
            </td>
            <td className="lista">
              {__campoLongitudSelect}
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="encabezado">
              Intersecciones
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="interseccionesSelect">Intersección:</label>
            </td>
            <td className="lista">
              {__interseccionesSelect}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="nombreInterseccionTextArea">Nombre:</label>
            </td>
            <td className="lista">
              {__nombreInterseccionTextArea}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="campoDestinoSelect">Campo Destino:</label>
            </td>
            <td className="lista">
              {__campoDestinoSelect}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="capaOrigenSelect">Capa Origen:</label>
            </td>
            <td className="lista">
              {__capaOrigenSelect}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="campoFuenteSelect">Campo Origen:</label>
            </td>
            <td className="lista">
              {__campoFuenteSelect}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              {__addInterseccionButton}
              <span>  </span>
              {__deleteInterseccionButton}
            </td>
          </tr> */}
        </table>
        </SettingSection>
      </div>
    </div>
  )
}

export default Setting
