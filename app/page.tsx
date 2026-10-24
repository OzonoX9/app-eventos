import Image from "next/image";
import { evento } from "@/lib/evento";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <a href="#inicio" className="brand" aria-label="Natsumatsuri 2026, inicio">
          <Image src="/brand/koi.png" alt="" width={46} height={40} />
          <span>NATSUMATSURI<small>PIRAPÓ · {evento.edicion}</small></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#festival">El festival</a>
          <a href="#programa">Programa</a>
          <a href="#ubicacion">Ubicación</a>
          <a href="#croquis">Croquis</a>
          <a href="#stands">Stands</a>
        </nav>
        <a className="header-cta" href="/natsumatsuri-2026.ics" download>Guardá la fecha <Arrow /></a>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-topline">
            <span className="eyebrow"><i /> TRADICIÓN QUE NOS ENCUENTRA</span>
            <span className="hero-edition">夏祭り <span>EDICIÓN {evento.edicion}</span></span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-location">PIRAPÓ, PARAGUAY</p>
              <h1 id="hero-title"><span className="sr-only">Natsumatsuri 2026</span><span aria-hidden="true">NATSU<br /><span className="title-outline">MATSURI</span><span className="title-period">.</span></span></h1>
              <p className="hero-description">{evento.lema}</p>
              <div className="hero-actions">
                <a className="button button-red" href="/natsumatsuri-2026.ics" download>Nos vemos el 14 de noviembre <Arrow /></a>
                <a className="text-link" href="#festival">Descubrí el festival <span aria-hidden="true">↓</span></a>
              </div>
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
          <div className="hero-bottom"><span>UN ENCUENTRO. MUCHAS HISTORIAS.</span><a href="#festival">SEGUÍ EXPLORANDO <span aria-hidden="true">↓</span></a></div>
        </section>

        <section className="date-band" aria-label="Fecha y lugar del evento">
          <div className="date-number"><span>14</span><div>NOVIEMBRE<small>SÁBADO · 2026</small></div></div>
          <div className="date-time"><span>DESDE LAS</span><strong>{evento.hora}<small> H</small></strong></div>
          <div className="date-place"><span>NOS ENCONTRAMOS EN</span><p>{evento.lugar}</p></div>
          <a href={evento.mapa} target="_blank" rel="noopener noreferrer" className="date-arrow" aria-label="Buscar la ubicación en Google Maps"><Arrow /></a>
        </section>

        <section className="festival section-light" id="festival" aria-labelledby="festival-title">
          <div className="section-heading"><span className="eyebrow">01 — EL FESTIVAL</span><span className="small-japanese" aria-hidden="true">つながり</span></div>
          <div className="festival-grid">
            <h2 id="festival-title">Japón que<br />nos <em>reúne.</em></h2>
            <div className="festival-copy">
              <p className="lead">La alegría que nos une!!</p>
              <p>Este 14 de noviembre, Natsumatsuri vuelve a reunirnos en Pirapó. Una invitación a compartir la cultura japonesa, reencontrarnos y ser parte de una misma celebración.</p>
              <p>Reservá la fecha y vení a vivir una noche que se construye entre todos.</p>
              <a className="text-link dark-link" href="#ubicacion">Nuestro punto de encuentro <Arrow /></a>
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
        </section>

        <section className="program section-dark" id="programa" aria-labelledby="program-title">
          <div className="section-heading"><span className="eyebrow">02 — LA NOCHE</span><span className="section-note">14.11.2026 / PIRAPÓ</span></div>
          <div className="program-heading"><h2 id="program-title">Una fecha.<br /><span>Todo por vivir.</span></h2><p>El encuentro ya tiene día y hora.<br />El programa completo, muy pronto.</p></div>
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

        <section className="location section-light" id="ubicacion" aria-labelledby="location-title">
          <div className="section-heading"><span className="eyebrow">03 — EL PUNTO DE ENCUENTRO</span><span className="small-japanese" aria-hidden="true">ここで会おう</span></div>
          <div className="location-grid">
            <div>
              <h2 id="location-title">Nos vemos<br />en <em>Pirapó.</em></h2>
              <p className="location-name">{evento.lugar}</p>
              <p className="muted-dark">{evento.ciudad}</p>
              <a href={evento.mapa} target="_blank" rel="noopener noreferrer" className="button button-dark">Buscar cómo llegar <Arrow /></a>
              <p className="map-note">Se abre una búsqueda del lugar en Google Maps.</p>
            </div>
            <div className="location-poster">
              <div className="poster-top"><span>DESTINO</span><span>PARAGUAY</span></div>
              <div className="poster-art" aria-hidden="true"><span className="pin-ring" /><span className="pin-core" /><span className="map-line map-line-one" /><span className="map-line map-line-two" /><span className="map-line map-line-three" /></div>
              <strong>PIRAPÓ<span>ITAPÚA</span></strong>
              <div className="poster-bottom"><span>14 NOV 2026</span><span>18:00 H ↗</span></div>
            </div>
          </div>
        </section>

        <section className="venue-plan section-dark" id="croquis" aria-labelledby="croquis-title">
          <div className="section-heading"><span className="eyebrow">04 — CROQUIS DEL EVENTO</span><span className="section-note">TU GUÍA DENTRO DEL FESTIVAL</span></div>
          <div className="directory-heading">
            <h2 id="croquis-title">Encontrá tu<br /><span>próximo destino.</span></h2>
            <p>Un vistazo al espacio donde<br />vamos a compartir la noche.</p>
          </div>
          {evento.croquis ? (
            <figure className="venue-plan-figure">
              <a href={evento.croquis.src} target="_blank" rel="noopener noreferrer" aria-label="Abrir el croquis del evento en tamaño completo">
                <Image src={evento.croquis.src} alt={evento.croquis.alt} width={evento.croquis.ancho} height={evento.croquis.alto} sizes="(max-width: 760px) 88vw, 86vw" />
              </a>
              <figcaption>Consultá la distribución del evento. <a href={evento.croquis.src} target="_blank" rel="noopener noreferrer">Ver en tamaño completo <Arrow /></a></figcaption>
            </figure>
          ) : (
            <div className="venue-plan-pending">
              <span className="plan-symbol" aria-hidden="true"><span /><span /><span /><span /></span>
              <span className="pending-tag">EN PREPARACIÓN</span>
              <h3>El croquis estará disponible muy pronto.</h3>
              <p>Acá vas a poder consultar la distribución del recinto y ubicarte dentro del evento.</p>
            </div>
          )}
        </section>

        <section className="stands section-light" id="stands" aria-labelledby="stands-title">
          <div className="section-heading"><span className="eyebrow">05 — STANDS PRESENTES</span><span className="small-japanese" aria-hidden="true">出会い</span></div>
          <div className="directory-heading">
            <h2 id="stands-title">Un paseo.<br /><em>Mil encuentros.</em></h2>
            <p>Una primera guía de los stands<br />y sus ubicaciones en el croquis.</p>
          </div>
          {evento.stands.length > 0 ? (
            <>
            <aside className="stands-notice" aria-label="Información provisional de stands">
              <span className="eyebrow">LISTADO PROVISIONAL</span>
              <p>Las referencias de color corresponden al croquis. Los menús de los distintos stands todavía no están disponibles.</p>
              {evento.stands.some((stand) => stand.pendiente) && <p>Los stands de alquiler tienen sus nombres y propuestas por confirmar. La numeración es solo para esta lista; no indica una posición en el croquis.</p>}
            </aside>
            <ul className="stand-list">
              {evento.stands.map((stand) => (
                <li key={stand.id} className="stand-card">
                  <div className="stand-meta"><span>{stand.categoria}</span>{stand.pendiente && <span className="stand-pending-tag">POR DEFINIR</span>}</div>
                  <h3>{stand.nombre}</h3>
                  {stand.color && <p className="stand-color-label"><span className={`stand-color stand-color-${stand.color}`} aria-hidden="true" /><span>Color en el croquis: <strong>{stand.color}</strong></span></p>}
                  {stand.ubicacion && <p className="stand-location">{stand.ubicacion}</p>}
                  {stand.pendiente && <p>Ocupante y ubicación individual por confirmar.</p>}
                  {stand.descripcion && <p>{stand.descripcion}</p>}
                  {stand.instagram && <a className="text-link dark-link" href={stand.instagram} target="_blank" rel="noopener noreferrer">Ver en Instagram <Arrow /></a>}
                </li>
              ))}
            </ul>
            </>
          ) : (
            <div className="stands-pending">
              <span className="stand-symbol" aria-hidden="true">＋</span>
              <div><h3>Estamos preparando la lista de stands.</h3><p>Los nombres y las propuestas se anunciarán acá cuando estén confirmados.</p></div>
              <span className="pending-tag">PRÓXIMAMENTE</span>
            </div>
          )}
          <a className="text-link dark-link stands-plan-link" href="#croquis">Consultá el croquis del evento <span aria-hidden="true">↑</span></a>
        </section>

        <section className="sponsors section-dark" id="patrocinadores" aria-labelledby="sponsors-title">
          <div className="section-heading"><span className="eyebrow">06 — QUIENES HACEN POSIBLE EL ENCUENTRO</span></div>
          <div className="organizer">
            <div><span className="eyebrow">ORGANIZA</span><h3>{evento.organizador.nombre}</h3></div>
            <a href={evento.organizador.url} target="_blank" rel="noopener noreferrer" className="organizer-instagram"><span>SEGUÍ LAS NOVEDADES EN INSTAGRAM<strong>@{evento.organizador.instagram}</strong></span><Arrow /></a>
          </div>
          <div className="sponsors-heading"><h2 id="sponsors-title">Una celebración.<br /><span>Muchas manos.</span></h2><p>Un espacio para reconocer a quienes<br />acompañan Natsumatsuri 2026.</p></div>
          {evento.patrocinadores.length > 0 ? (
            <ul className="sponsor-list">{evento.patrocinadores.map((p) => (
              <li key={p.nombre}>{p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer"><Image src={p.logo} alt={p.nombre} width={180} height={90} /></a> : <Image src={p.logo} alt={p.nombre} width={180} height={90} />}</li>
            ))}</ul>
          ) : <div className="sponsor-pending"><span aria-hidden="true">＋</span><p>Próximamente anunciaremos a nuestros patrocinadores.</p><small>GRACIAS POR SER PARTE.</small></div>}
        </section>

        <section className="closing" aria-labelledby="closing-title">
          <span className="eyebrow">14 NOVIEMBRE · 18:00 H · PIRAPÓ</span>
          <h2 id="closing-title">La tradición sigue.<br />El encuentro <em>es acá.</em></h2>
          <a href="/natsumatsuri-2026.ics" download className="button button-light">Guardá Natsumatsuri en tu calendario <Arrow /></a>
          <span className="closing-japanese" aria-hidden="true">夏祭り</span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-wordmark" href="#inicio">NATSUMATSURI<span>2026</span></a>
        <div><p>Organiza: {evento.organizador.nombre}</p><p><a href={evento.organizador.url} target="_blank" rel="noopener noreferrer">@{evento.organizador.instagram} <Arrow /></a></p><p>{evento.lugar}</p><p>{evento.ciudad}</p></div>
        <a className="back-top" href="#inicio">VOLVER ARRIBA <span aria-hidden="true">↑</span></a>
      </footer>
    </>
  );
}
