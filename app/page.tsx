import Image from "next/image";
import Link from "next/link";
import HomePanels from "@/app/components/HomePanels";
import { evento } from "@/lib/evento";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const stands = evento.stands.filter((stand) => !stand.pendiente);
  return (
    <HomePanels header={<>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <a href="#inicio" className="brand" aria-label="Natsumatsuri 2026, inicio">
          <Image src="/brand/koi.png" alt="" width={46} height={40} />
          <span>NATSUMATSURI<small>PIRAPÓ · {evento.edicion}</small></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#ubicacion">Ubicación</a>
          <a href="#croquis">Croquis</a>
          <a href="#stands">Stands</a>
          <a href="#programa">Cronograma</a>
          <a href="#patrocinadores">Auspiciantes</a>
          <a href="#organizador">Organizador</a>
        </nav>
        <a className="header-cta" href="/natsumatsuri-2026.ics" download>Guardá la fecha <Arrow /></a>
      </header>
      </>}>
      <main id="contenido" className="home-panels" tabIndex={-1}>
        <div className="home-panel-group" data-panel="inicio">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-topline">
            <span className="eyebrow"><i /> TRADICIÓN QUE NOS ENCUENTRA</span>
            {/*<span className="hero-edition">夏祭り <span>EDICIÓN {evento.edicion}</span></span>*/}
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-location">PIRAPÓ, PARAGUAY</p>
              <h1 id="hero-title"><span className="sr-only">Natsumatsuri 2026</span><span aria-hidden="true">NATSU<br /><span className="title-outline">MATSURI</span><span className="title-period">.</span></span></h1>
              <p className="hero-description">{evento.lema}</p>
              {
              /* <div className="hero-actions">
                <a className="button button-red" href="/natsumatsuri-2026.ics" download>Nos vemos el 14 de noviembre <Arrow /></a>
                <a className="text-link" href="#ubicacion">Ubicación del evento <span aria-hidden="true">↓</span></a>
              </div> */
              }
            </div>
            <div className="hero-art">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <span className="art-cross cross-one" aria-hidden="true">+</span>
              <span className="art-cross cross-two" aria-hidden="true">+</span>
              <span className="art-side-label" aria-hidden="true">夏 · 祭 · り</span>
              <Image className="hero-koi" src="/brand/koi.png" alt="Koi rojo y naranja del emblema de Natsumatsuri" width={813} height={695} sizes="(max-width: 760px) 88vw, 49vw" preload />
              <div className="art-center" aria-hidden="true"><span>夏祭り</span><small>PIRAPÓ</small><strong>2026</strong></div>
              <span className="art-caption">EL ESPÍRITU DEL ENCUENTRO</span>
            </div>
          </div>
          <div className="hero-bottom"><span>UN ENCUENTRO. MUCHAS HISTORIAS.</span><a href="#ubicacion">SEGUÍ EXPLORANDO <span aria-hidden="true">→</span></a></div>
        </section>

        <section className="date-band" aria-label="Fecha y lugar del evento">
          <div className="date-number"><span>14</span><div>NOVIEMBRE<small>SÁBADO · 2026</small></div></div>
          <div className="date-time"><span>DESDE LAS</span><strong>{evento.hora}<small> H</small></strong></div>
          <div className="date-place"><span>NOS ENCONTRAMOS EN</span><p>{evento.lugar}</p></div>
          {/* <a href={evento.mapa} target="_blank" rel="noopener noreferrer" className="date-arrow" aria-label="Buscar la ubicación en Google Maps"><Arrow /></a> */}
        </section>
          <details className="festival-about" id="festival">
            <summary>Sobre Natsumatsuri</summary>
            <div className="festival section-light">
          <div className="section-heading"><span className="eyebrow">01 — EL FESTIVAL</span><span className="small-japanese" aria-hidden="true">つながり</span></div>
          <div className="festival-grid">
            <h2 id="festival-title">Japón que<br />nos <em>reúne.</em></h2>
            <div className="festival-copy">
              <p className="lead">La alegría que nos une!!</p>
              <p>Este 14 de noviembre, Natsumatsuri vuelve a reunirnos en Pirapó. Una invitación a compartir la cultura japonesa, reencontrarnos y ser parte de una misma celebración.</p>
              <p>Reservá la fecha y vení a vivir una noche que se construye entre todos.</p>
              {/* <a className="text-link dark-link" href="#ubicacion">Nuestro punto de encuentro <Arrow /></a> */}
            </div>
          </div>
          <div className="experiences">
            <h3>Todo lo que te espera en esta gran fiesta!</h3>
            <ul className="experience-grid">
              {evento.experiencias.map((experiencia) => (
                <li key={experiencia.titulo}>
                  <span className="experience-icon" aria-hidden="true">{experiencia.icono}</span>
                  <span>{experiencia.titulo}</span>
                </li>
              ))}
            </ul>
            <p className="festival-invitation">{evento.invitacion} <span aria-hidden="true">❤️🇯🇵</span></p>
          </div>
          <div className="festival-footnote"><span>RAÍCES JAPONESAS.</span><span>ESPÍRITU DE COMUNIDAD.</span><span>UN ENCUENTRO EN PIRAPÓ.</span></div>
            </div>
          </details>
        </div>

        <section className="location section-light" id="ubicacion" data-panel="ubicacion" aria-labelledby="location-title">
          <div className="section-heading"><span className="eyebrow">02 — UBICACIÓN DEL EVENTO</span></div>
          <h2 id="location-title">Nos vemos<br />en <em>Pirapó.</em></h2>
          <div className="location-info">
            <p className="location-name">{evento.lugar}</p>
            <p className="muted-dark">{evento.ciudad}</p>
            <p className="location-date">{evento.fecha} de {evento.edicion} · Desde las {evento.hora} h</p>
            <a href={evento.mapa} target="_blank" rel="noopener noreferrer" className="button button-dark">Ver ubicación en Google Maps <Arrow /></a>
            <details className="parking-options stand-item mt-6 border-y border-black/20">
              <summary>
                <span className="stand-name">Opciones de estacionamiento</span>
                <span className="stand-toggle" aria-hidden="true" />
              </summary>
              <div className="stand-item-content">
                <ul className="space-y-3">
                  {evento.estacionamientos.map((estacionamiento) => (
                    <li key={estacionamiento.url}>
                      <a className="text-link dark-link" href={estacionamiento.url} target="_blank" rel="noopener noreferrer">
                        <span>{estacionamiento.nombre}</span><Arrow />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
            <p className="map-note">El enlace abre la búsqueda del recinto en Google Maps.</p>
          </div>
        </section>

        <section className="venue-plan section-dark" id="croquis" data-panel="croquis" aria-labelledby="croquis-title">
          <div className="section-heading"><span className="eyebrow">03 — CROQUIS DEL EVENTO</span><span className="section-note">TU GUÍA DENTRO DEL FESTIVAL</span></div>
          <div className="directory-heading">
            <h2 id="croquis-title">Encontrá tu<br /><span>próximo destino.</span></h2>
            <p>Un vistazo al espacio donde<br />vamos a compartir la noche.</p>
          </div>
          {evento.croquis ? (
            <figure className="venue-plan-figure">
              <div className="map-entry">
                <Link href="/mapa" target="_blank" rel="noopener noreferrer" className="button button-red">Abrir mapa interactivo <Arrow /></Link>
                <p>Se abre en una pestaña nueva. Tocá los cinco stands con nombre para consultar sus flyers o menús.</p>
              </div>
              <a href={evento.croquis.src} target="_blank" rel="noopener noreferrer" aria-label="Abrir el croquis del evento en tamaño completo">
                <Image src={evento.croquis.src} alt={evento.croquis.alt} width={evento.croquis.ancho} height={evento.croquis.alto} sizes="(max-width: 760px) 88vw, 86vw" />
              </a>
              {/*<figcaption>Consultá la distribución del evento. <a href={evento.croquis.src} target="_blank" rel="noopener noreferrer">Ver en tamaño completo <Arrow /></a></figcaption>*/}            </figure>
          ) : (
            <div className="venue-plan-pending">
              <span className="plan-symbol" aria-hidden="true"><span /><span /><span /><span /></span>
              <span className="pending-tag">EN PREPARACIÓN</span>
              <h3>El croquis estará disponible muy pronto.</h3>
              <p>Acá vas a poder consultar la distribución del recinto y ubicarte dentro del evento.</p>
            </div>
          )}
        </section>

        <section className="stands section-light" id="stands" data-panel="stands" aria-labelledby="stands-title">
          <div className="section-heading"><span className="eyebrow">04 — STANDS Y MENÚS</span><span className="small-japanese" aria-hidden="true">出会い</span></div>
          <div className="directory-heading">
            <h2 id="stands-title">Elegí un stand.<br /><em>Descubrí su propuesta.</em></h2>
            <p>Desplegá cada nombre para ver<br />su ubicación y acceder al flyer o menú.</p>
          </div>
          {stands.length > 0 ? (
            <>
              <p className="stand-menu-note">Consultá el flyer de cada stand. Los que todavía no tienen flyer muestran un menú de ejemplo, no oficial.</p>
              <ul className="stand-accordion">
                {stands.map((stand) => (
                  <li key={stand.id}>
                    <details className="stand-item" name="stands">
                      <summary>
                        {stand.color && <span className={`stand-color stand-color-${stand.color}`} aria-hidden="true" />}
                        <span className="stand-name">{stand.nombre}</span>
                        <span className="stand-toggle" aria-hidden="true" />
                      </summary>
                      <div className="stand-item-content">
                        {stand.color && <p className="stand-color-label">Color en el croquis: <strong>{stand.color}</strong></p>}
                        {stand.ubicacion && <p>{stand.ubicacion}</p>}
                        {stand.descripcion && <p>{stand.descripcion}</p>}
                        {stand.flyer ? (
                          <Link className="button button-dark" href={`/stands/${stand.id}`}>Ver flyer / menú <Arrow /></Link>
                        ) : stand.puntoMapa ? (
                          <Link className="button button-dark" href={`/stands/${stand.id}`}>Ver flyer / menú de ejemplo <Arrow /></Link>
                        ) : <p>Menú próximamente.</p>}
                        {stand.instagram && <a className="text-link dark-link" href={stand.instagram} target="_blank" rel="noopener noreferrer">Ver en Instagram <Arrow /></a>}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </>
          ) : <p className="stand-menu-note">Estamos preparando la lista de stands.</p>}
          <a className="text-link dark-link stands-plan-link" href="#croquis">Consultá el croquis del evento</a>
        </section>

        <section className="program section-dark" id="programa" data-panel="programa" aria-labelledby="program-title">
          <div className="section-heading"><span className="eyebrow">05 — CRONOGRAMA DEL EVENTO</span><span className="section-note">14.11.2026 / PIRAPÓ</span></div>
          <div className="program-heading"><h2 id="program-title">El cronograma<br /><span>de nuestra noche.</span></h2><p>El encuentro ya tiene día y hora.<br />El programa completo, muy pronto.</p></div>
          <div className="schedule">
            {evento.programa.map((actividad) => (
              <article className="schedule-row" key={`${actividad.hora}-${actividad.titulo}`}>
                <time dateTime={evento.inicio}>{actividad.hora}<small> H</small></time>
                <div><span className="schedule-label">EL ENCUENTRO</span><h3>{actividad.titulo}</h3><p>{actividad.descripcion}</p></div>
                <span className="schedule-star" aria-hidden="true">✳</span>
              </article>
            ))}
            <div className="schedule-pending"><span className="pending-dot" /><p>Estamos preparando los detalles. Las actividades y sus horarios se anunciarán aquí.</p><span className="pending-tag">PRÓXIMAMENTE</span></div>
          </div>
        </section>

        <section className="sponsors section-dark" id="patrocinadores" data-panel="patrocinadores" aria-labelledby="sponsors-title">
          <div className="section-heading"><span className="eyebrow">06 — AUSPICIANTES</span></div>
          <div className="sponsors-heading"><h2 id="sponsors-title">Una celebración.<br /><span>Muchas manos.</span></h2><p>Un espacio para reconocer a quienes<br />acompañan Natsumatsuri 2026.</p></div>
          {evento.patrocinadores.length > 0 ? (
            <ul className="sponsor-list">{evento.patrocinadores.map((p) => (
              <li key={p.nombre}>{p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer"><Image src={p.logo} alt={p.nombre} width={180} height={90} /></a> : <Image src={p.logo} alt={p.nombre} width={180} height={90} />}</li>
            ))}</ul>
          ) : <div className="sponsor-pending"><span aria-hidden="true">＋</span><p>Próximamente anunciaremos a nuestros auspiciantes.</p><small>GRACIAS POR SER PARTE.</small></div>}
        </section>

        <div className="home-panel-group" data-panel="organizador">
        <section className="section-dark organizer-section" id="organizador" aria-labelledby="organizer-title">
          <div className="section-heading"><span className="eyebrow">07 — ORGANIZADOR</span></div>
          <h2 id="organizer-title">El equipo<br /><span>detrás del encuentro.</span></h2>
          <div className="organizer">
            <div><span className="eyebrow">ORGANIZA</span><h3>{evento.organizador.nombre}</h3></div>
            <a href={evento.organizador.url} target="_blank" rel="noopener noreferrer" className="organizer-instagram"><span>SEGUÍ LAS NOVEDADES EN INSTAGRAM<strong>@{evento.organizador.instagram}</strong></span><Arrow /></a>
          </div>
        </section>
        <section className="closing" aria-labelledby="closing-title">
          <span className="eyebrow">14 NOVIEMBRE · 18:00 H · PIRAPÓ</span>
          <h2 id="closing-title">La tradición sigue.<br />El encuentro <em>es acá.</em></h2>
          <a href="/natsumatsuri-2026.ics" download className="button button-light">Guardá Natsumatsuri en tu calendario <Arrow /></a>
          <span className="closing-japanese" aria-hidden="true">夏祭り</span>
        </section>
      <footer className="site-footer">
        <a className="footer-wordmark" href="#inicio">NATSUMATSURI<span>2026</span></a>
        <div><p>Organiza: {evento.organizador.nombre}</p><p><a href={evento.organizador.url} target="_blank" rel="noopener noreferrer">@{evento.organizador.instagram} <Arrow /></a></p><p>{evento.lugar}</p><p>{evento.ciudad}</p></div>
        <a className="back-top" href="#inicio">VOLVER Al INICIO <span aria-hidden="true">←</span></a>
      </footer>
        </div>
      </main>
    </HomePanels>
  );
}
