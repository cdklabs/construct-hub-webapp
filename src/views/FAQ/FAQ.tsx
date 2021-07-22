import { Box, Heading, Accordion } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { FAQItem } from "./FAQItem";
import { FAQSection } from "./FAQSection";

export const FAQ: FunctionComponent = () => (
  <Box bg="white" color="blue.800" h="100%" w="100%">
    <Box bg="gray.50" py={20} width="100%">
      <Heading as="h1" mx="auto" textAlign="center">
        Frequently Asked Questions
      </Heading>
    </Box>
    <Accordion allowMultiple defaultIndex={[0, 1]}>
      {/* Actual FAQ in progress, just using lorem for time being */}
      <FAQSection heading="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore, veniam.">
        <FAQItem question="Lorem ipsum dolor">
          <span>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. At
            reiciendis qui illo est ullam magni modi sapiente praesentium
            similique molestiae. Explicabo aliquid animi non fugit aliquam minus
            doloremque ad reiciendis.
          </span>
          <span>
            Minus cumque saepe optio veritatis debitis tempora non eos earum
            fugiat animi aut, explicabo vero tenetur, amet, exercitationem unde
            deserunt dolorum molestiae itaque dolor ad consequatur repudiandae?
            Esse, laboriosam recusandae.
          </span>
          <span>
            Esse sit explicabo alias quaerat eum quos dolorum iusto suscipit
            excepturi beatae porro nemo tenetur nulla tempore, a iure
            consequatur nam eius voluptatibus placeat numquam! Fugiat voluptates
            sed voluptatum deleniti!
          </span>
          <span>
            Architecto, illo! Porro perspiciatis assumenda illo laboriosam eos
            at iste, et maiores voluptatum! Quaerat quos laborum tempore modi
            sit optio beatae nesciunt illo facere? Blanditiis magnam consequatur
            eveniet omnis pariatur?
          </span>
          <span>
            Ratione possimus quas delectus quidem sunt vitae tempore adipisci
            fugit modi ex vero odio voluptates, repudiandae quasi. Distinctio
            alias nemo, labore odio unde itaque rerum, maiores, fugiat
            praesentium in consectetur.
          </span>
        </FAQItem>
        <FAQItem question="Lorem ipsum dolor">
          <span>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. At
            reiciendis qui illo est ullam magni modi sapiente praesentium
            similique molestiae. Explicabo aliquid animi non fugit aliquam minus
            doloremque ad reiciendis.
          </span>
          <span>
            Minus cumque saepe optio veritatis debitis tempora non eos earum
            fugiat animi aut, explicabo vero tenetur, amet, exercitationem unde
            deserunt dolorum molestiae itaque dolor ad consequatur repudiandae?
            Esse, laboriosam recusandae.
          </span>
          <span>
            Esse sit explicabo alias quaerat eum quos dolorum iusto suscipit
            excepturi beatae porro nemo tenetur nulla tempore, a iure
            consequatur nam eius voluptatibus placeat numquam! Fugiat voluptates
            sed voluptatum deleniti!
          </span>
          <span>
            Architecto, illo! Porro perspiciatis assumenda illo laboriosam eos
            at iste, et maiores voluptatum! Quaerat quos laborum tempore modi
            sit optio beatae nesciunt illo facere? Blanditiis magnam consequatur
            eveniet omnis pariatur?
          </span>
          <span>
            Ratione possimus quas delectus quidem sunt vitae tempore adipisci
            fugit modi ex vero odio voluptates, repudiandae quasi. Distinctio
            alias nemo, labore odio unde itaque rerum, maiores, fugiat
            praesentium in consectetur.
          </span>
        </FAQItem>
        <FAQItem question="Lorem ipsum dolor">
          <span>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. At
            reiciendis qui illo est ullam magni modi sapiente praesentium
            similique molestiae. Explicabo aliquid animi non fugit aliquam minus
            doloremque ad reiciendis.
          </span>
          <span>
            Minus cumque saepe optio veritatis debitis tempora non eos earum
            fugiat animi aut, explicabo vero tenetur, amet, exercitationem unde
            deserunt dolorum molestiae itaque dolor ad consequatur repudiandae?
            Esse, laboriosam recusandae.
          </span>
          <span>
            Esse sit explicabo alias quaerat eum quos dolorum iusto suscipit
            excepturi beatae porro nemo tenetur nulla tempore, a iure
            consequatur nam eius voluptatibus placeat numquam! Fugiat voluptates
            sed voluptatum deleniti!
          </span>
          <span>
            Architecto, illo! Porro perspiciatis assumenda illo laboriosam eos
            at iste, et maiores voluptatum! Quaerat quos laborum tempore modi
            sit optio beatae nesciunt illo facere? Blanditiis magnam consequatur
            eveniet omnis pariatur?
          </span>
          <span>
            Ratione possimus quas delectus quidem sunt vitae tempore adipisci
            fugit modi ex vero odio voluptates, repudiandae quasi. Distinctio
            alias nemo, labore odio unde itaque rerum, maiores, fugiat
            praesentium in consectetur.
          </span>
        </FAQItem>
        <FAQItem question="Lorem ipsum dolor">
          <span>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. At
            reiciendis qui illo est ullam magni modi sapiente praesentium
            similique molestiae. Explicabo aliquid animi non fugit aliquam minus
            doloremque ad reiciendis.
          </span>
          <span>
            Minus cumque saepe optio veritatis debitis tempora non eos earum
            fugiat animi aut, explicabo vero tenetur, amet, exercitationem unde
            deserunt dolorum molestiae itaque dolor ad consequatur repudiandae?
            Esse, laboriosam recusandae.
          </span>
          <span>
            Esse sit explicabo alias quaerat eum quos dolorum iusto suscipit
            excepturi beatae porro nemo tenetur nulla tempore, a iure
            consequatur nam eius voluptatibus placeat numquam! Fugiat voluptates
            sed voluptatum deleniti!
          </span>
          <span>
            Architecto, illo! Porro perspiciatis assumenda illo laboriosam eos
            at iste, et maiores voluptatum! Quaerat quos laborum tempore modi
            sit optio beatae nesciunt illo facere? Blanditiis magnam consequatur
            eveniet omnis pariatur?
          </span>
          <span>
            Ratione possimus quas delectus quidem sunt vitae tempore adipisci
            fugit modi ex vero odio voluptates, repudiandae quasi. Distinctio
            alias nemo, labore odio unde itaque rerum, maiores, fugiat
            praesentium in consectetur.
          </span>
        </FAQItem>
      </FAQSection>
      <FAQSection heading="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore, veniam.">
        <FAQItem question="Lorem ipsum dolor">
          <span>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. At
            reiciendis qui illo est ullam magni modi sapiente praesentium
            similique molestiae. Explicabo aliquid animi non fugit aliquam minus
            doloremque ad reiciendis.
          </span>
          <span>
            Minus cumque saepe optio veritatis debitis tempora non eos earum
            fugiat animi aut, explicabo vero tenetur, amet, exercitationem unde
            deserunt dolorum molestiae itaque dolor ad consequatur repudiandae?
            Esse, laboriosam recusandae.
          </span>
          <span>
            Esse sit explicabo alias quaerat eum quos dolorum iusto suscipit
            excepturi beatae porro nemo tenetur nulla tempore, a iure
            consequatur nam eius voluptatibus placeat numquam! Fugiat voluptates
            sed voluptatum deleniti!
          </span>
          <span>
            Architecto, illo! Porro perspiciatis assumenda illo laboriosam eos
            at iste, et maiores voluptatum! Quaerat quos laborum tempore modi
            sit optio beatae nesciunt illo facere? Blanditiis magnam consequatur
            eveniet omnis pariatur?
          </span>
          <span>
            Ratione possimus quas delectus quidem sunt vitae tempore adipisci
            fugit modi ex vero odio voluptates, repudiandae quasi. Distinctio
            alias nemo, labore odio unde itaque rerum, maiores, fugiat
            praesentium in consectetur.
          </span>
        </FAQItem>
        <FAQItem question="Lorem ipsum dolor">
          <span>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. At
            reiciendis qui illo est ullam magni modi sapiente praesentium
            similique molestiae. Explicabo aliquid animi non fugit aliquam minus
            doloremque ad reiciendis.
          </span>
          <span>
            Minus cumque saepe optio veritatis debitis tempora non eos earum
            fugiat animi aut, explicabo vero tenetur, amet, exercitationem unde
            deserunt dolorum molestiae itaque dolor ad consequatur repudiandae?
            Esse, laboriosam recusandae.
          </span>
          <span>
            Esse sit explicabo alias quaerat eum quos dolorum iusto suscipit
            excepturi beatae porro nemo tenetur nulla tempore, a iure
            consequatur nam eius voluptatibus placeat numquam! Fugiat voluptates
            sed voluptatum deleniti!
          </span>
          <span>
            Architecto, illo! Porro perspiciatis assumenda illo laboriosam eos
            at iste, et maiores voluptatum! Quaerat quos laborum tempore modi
            sit optio beatae nesciunt illo facere? Blanditiis magnam consequatur
            eveniet omnis pariatur?
          </span>
          <span>
            Ratione possimus quas delectus quidem sunt vitae tempore adipisci
            fugit modi ex vero odio voluptates, repudiandae quasi. Distinctio
            alias nemo, labore odio unde itaque rerum, maiores, fugiat
            praesentium in consectetur.
          </span>
        </FAQItem>
        <FAQItem question="Lorem ipsum dolor">
          <span>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. At
            reiciendis qui illo est ullam magni modi sapiente praesentium
            similique molestiae. Explicabo aliquid animi non fugit aliquam minus
            doloremque ad reiciendis.
          </span>
          <span>
            Minus cumque saepe optio veritatis debitis tempora non eos earum
            fugiat animi aut, explicabo vero tenetur, amet, exercitationem unde
            deserunt dolorum molestiae itaque dolor ad consequatur repudiandae?
            Esse, laboriosam recusandae.
          </span>
          <span>
            Esse sit explicabo alias quaerat eum quos dolorum iusto suscipit
            excepturi beatae porro nemo tenetur nulla tempore, a iure
            consequatur nam eius voluptatibus placeat numquam! Fugiat voluptates
            sed voluptatum deleniti!
          </span>
          <span>
            Architecto, illo! Porro perspiciatis assumenda illo laboriosam eos
            at iste, et maiores voluptatum! Quaerat quos laborum tempore modi
            sit optio beatae nesciunt illo facere? Blanditiis magnam consequatur
            eveniet omnis pariatur?
          </span>
          <span>
            Ratione possimus quas delectus quidem sunt vitae tempore adipisci
            fugit modi ex vero odio voluptates, repudiandae quasi. Distinctio
            alias nemo, labore odio unde itaque rerum, maiores, fugiat
            praesentium in consectetur.
          </span>
        </FAQItem>
        <FAQItem question="Lorem ipsum dolor">
          <span>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. At
            reiciendis qui illo est ullam magni modi sapiente praesentium
            similique molestiae. Explicabo aliquid animi non fugit aliquam minus
            doloremque ad reiciendis.
          </span>
          <span>
            Minus cumque saepe optio veritatis debitis tempora non eos earum
            fugiat animi aut, explicabo vero tenetur, amet, exercitationem unde
            deserunt dolorum molestiae itaque dolor ad consequatur repudiandae?
            Esse, laboriosam recusandae.
          </span>
          <span>
            Esse sit explicabo alias quaerat eum quos dolorum iusto suscipit
            excepturi beatae porro nemo tenetur nulla tempore, a iure
            consequatur nam eius voluptatibus placeat numquam! Fugiat voluptates
            sed voluptatum deleniti!
          </span>
          <span>
            Architecto, illo! Porro perspiciatis assumenda illo laboriosam eos
            at iste, et maiores voluptatum! Quaerat quos laborum tempore modi
            sit optio beatae nesciunt illo facere? Blanditiis magnam consequatur
            eveniet omnis pariatur?
          </span>
          <span>
            Ratione possimus quas delectus quidem sunt vitae tempore adipisci
            fugit modi ex vero odio voluptates, repudiandae quasi. Distinctio
            alias nemo, labore odio unde itaque rerum, maiores, fugiat
            praesentium in consectetur.
          </span>
        </FAQItem>
      </FAQSection>
    </Accordion>
  </Box>
);
