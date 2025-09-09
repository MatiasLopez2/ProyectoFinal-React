import stanley from "/img/stanley.png"

function Brands(){
    return(
        <>
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h3 className='section-title'>ENCONTRÁ TU MARCA</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
        
          <a href="" className="transition-transform hover:scale-30">
            <picture>
              <img src={stanley} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" />
              <img src={stanley} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" />
              <img src={stanley} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" />
              <img src={stanley} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" />
              <img src={stanley} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" />
              <img src={stanley} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" />
              <img src={stanley} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" />
            </picture>
          </a>
       
      </div>
    </div>
        </>
    )
}

export default Brands;