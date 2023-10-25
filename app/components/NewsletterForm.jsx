
export function NewsletterForm({menu}) {

  let raw = {
    'query' : `mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        userErrors {
          field
          message
        }
        customer {
          id
        }
      }
    }`,
    'variables': {
      'input': {
        'email': 'paul@test.com',
        'acceptMarketing': true,
        'tags': [
          'back-in-stock'
        ]
      }
    }

  }

  const onSubmitForm = async (event) => {
    console.log(event.target);
    const data = new FormData(event.target)
    let obj = {}
    for(let [key, value] of data){
      obj[key] = value;
    }
    console.log(obj);

    // await fetch ('http://localhost:3000/newsletter', {
    //   method: 'POST',
    //   body: JSON.stringify(obj),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log(data);
    // })
    // .catch(error => {
    //   console.log(error);
    // })
  }
  return (
    <div>
      <form class="newsletter-form" onSubmit={onSubmitForm}>
        <input name="email" placeholder="your@email.com" type="email" />
        <button className="submit-form" type="submit">Subscribe</button>
      </form>
    </div>
  );
}