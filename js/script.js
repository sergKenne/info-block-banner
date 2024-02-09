let slideItems = localStorage.getItem('items')
    ? JSON.parse(localStorage.getItem('items'))
    : [
          {
              id: 1,
              title: 'Кварцевый песок от производства до поставки',
              desc: 'Качество нашей продукции основано на высококачественных месторождениях и технологии обогащения с учетом потребностей наших покупателей. Мы инвестируем в обе составляющие!',
              img: './assets/img/main-page/slider1-picture.jpg',
          },
          {
              id: 2,
              title: 'Заголовок',
              desc: 'Качество нашей продукции основано на высококачественных месторождениях и технологии обогащения с учетом потребностей наших покупателей. Мы инвестируем в обе составляющие!',
              img: './assets/img/main-page/slider2-picture.jpg',
          },
          {
              id: 3,
              title: 'производства до поставки',
              desc: 'Качество нашей продукции основано на высококачественных месторождениях и технологии обогащения с учетом потребностей наших покупателей. Мы инвестируем в обе составляющие!',
              img: './assets/img/main-page/slider2-picture.png',
          },
      ];

const setInLocalStorageAndRedirect = (keyName, value, redirect) => {
    try {
        localStorage.setItem(keyName, JSON.stringify(value));
        window.location.href = redirect;
    } catch (error) {
        alert('Error in local storage' + error);
    }
};

function render(sliders) {
    const sliderContent = document.getElementById('slider-content');
    sliderContent.innerHTML = slideItems?.map((slider) => {
        return `<div class="swiper-slide slider-primary__slide">
                <img class="slider-primary__img" src=${slider.img} alt="">
                <div class="slider-primary__content"><h1 class="slider-primary__title">${slider.title}</h1>
                    <p class="slider-primary__text">${slider.desc}</p>
                </div>
            </div>`;
    });
}

function renderDelete(sliders) {
    const deleteItems = document.getElementById('delete-items');
    deleteItems.innerHTML = slideItems?.map((item) => {
        return `<div class="card">
          <img src=${item.img} alt="" class="card__img">
          <h3 class="card__title">${item.title}</h3>
          <p class="card__desc">${item.desc}</p>
          <div class="card__btns">
            <a href="edit.html?id='${item.id}'" class="form__btn form__btn--primary">Edit</a>
            <button class="form__btn form__btn--danger" onclick="deleteSlider('${item.id}')">Delete</button>
          </div>
        </div>`;
    });
}

function deleteSlider(id) {
    console.log(id);
    slideItems = slideItems.filter((item) => item.id != id);
    localStorage.setItem('items', JSON.stringify(slideItems));
    renderDelete(slideItems);
}

const pathname = window.location.pathname.split('/').slice(-1)[0];

if (pathname == 'index.html') {
    render(slideItems);
} else if (pathname == 'actions.html') {
    renderDelete(slideItems);
} else if (pathname == 'edit.html') {
    let params = new URLSearchParams(window.location.search);
    let id = [...params.get('id')][1];
    const item = slideItems?.find((elt) => elt.id == id);

    const title = document.getElementById('title');
    const desc = document.getElementById('desc');
    const preview = document.getElementById('preview');
    const editFile = document.getElementById('editFile');
    const editBtn = document.getElementById('editBtn');

    title.value = item?.title;
    desc.value = item?.desc;
    preview.src = item?.img;

    const newSlider = {
        ...item,
        title: title.value,
        desc: desc.value,
    };

    editBtn.addEventListener('click', () => {
        console.log('title:', title.value);
        if (title.value.length == 0 || desc.value.length == 0) {
            alert('Please fill all fields');
        } else {
            slideItems = slideItems.map((item) => (item.id == id ? newSlider : item));
            setInLocalStorageAndRedirect('items', slideItems, 'index.html');
        }
    });

    editFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
            preview.src = `data:image/png;base64,${base64String}`;
            newSlider.img = `data:image/png;base64,${base64String}`;
        };
        reader.readAsDataURL(file);
    });
} else if (pathname == 'create.html') {
    const title = document.getElementById('inputTitle');
    const desc = document.getElementById('inputDesc');
    const inputFile = document.getElementById('inputFile');
    const outPreview = document.getElementById('outPreview');
    const createBtn = document.getElementById('createBtn');

    let newSlider = {
        id: '',
        title: '',
        desc: '',
        img: 'https://shkolauvinskayauva-r18.gosweb.gosuslugi.ru/netcat_files/8/168/zaglushka_1.jpg',
    };
    createBtn.addEventListener('click', (event) => {
        event.preventDefault();
        newSlider = {
            ...newSlider,
            id: slideItems.length + 1,
            title: title.value,
            desc: desc.value,
        };

        if (title.value.length == 0 || desc.value.length == 0) {
            alert('Please fill all fields');
        } else {
            slideItems = [...slideItems, newSlider];
            console.log('SliderItem:', slideItems);
            setInLocalStorageAndRedirect('items', slideItems, 'index.html');
        }
    });

    inputFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            console.log(reader);
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
            outPreview.src = `data:image/png;base64,${base64String}`;
            newSlider.img = `data:image/png;base64,${base64String}`;
            console.log('NewSlider:', newSlider);
        };
        reader.readAsDataURL(file);
    });
}
