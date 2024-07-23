"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { useSession } from "@/providers/SessionProvider";
import { pricingList } from "@/app/constants/stripe";

const PricingItem = ({ pricing }) => {
  const { planTitle, price, link, timeline, description, features, isActive } =
    pricing;
  const user = useSession();
  return (
    <div
      className={`${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-blue-50 text-zinc-900 dark:bg-[#101D2C] dark:text-white"
      } rounded-2xl shadow p-4 lg:p-12 h-full`}
    >
      <h3 className="text-3xl font-bold mb-2">{planTitle}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        <span className="ml-2 opacity-50">{timeline}</span>
      </div>
      <p className="opacity-50 mb-6">{description}</p>
      <ul className="flex flex-col">
        {features.map((item, i) => (
          <li className="mb-4" key={i}>
            <FontAwesomeIcon
              icon={item.isActive ? faCheck : faTimes}
              className={`${!isActive ? "text-blue-600" : "text-white"} mr-2`}
            />
            <span className="opacity-50">{item.label}</span>
          </li>
        ))}
      </ul>
      <a href={`${link}?prefilled_email=${user?.email}`} target="_blank">
        <button
          className={`${
            isActive
              ? "bg-white text-black"
              : "bg-blue-600 bg-opacity-10 hover:bg-blue-600 hover:text-white"
          }  rounded-md px-7 py-3 w-full mt-6 duration-300`}
        >
          Choose plan
        </button>
      </a>
    </div>
  );
};

PricingItem.propTypes = {
  pricing: PropTypes.object.isRequired,
};

const Pricing = () => {
  const [activeTimeline, setActiveTimeline] = useState("yearly");
  console.log(activeTimeline);

  let content = null;
  if (activeTimeline === "monthly") {
    content = pricingList.monthlyPricings.map((pricing, i) => {
      return (
        <div className="lg:max-w-md mt-6" key={i}>
          <PricingItem pricing={pricing} />
        </div>
      );
    });
  }
  if (activeTimeline === "yearly") {
    content = pricingList.yearlyPricings.map((pricing, i) => (
      <div className="lg:max-w-md mt-6" key={i}>
        <PricingItem pricing={pricing} />
      </div>
    ));
  }

  return (
    <section className="ezy__pricing8 light py-14 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white relative z-[1]">
      <div className="container px-4 mx-auto">
        <div className="flex justify-center mb-12">
          <div className="max-w-xl text-center">
            <h2 className="text-3xl font-bold leading-none md:text-[45px] mb-4">
              Flexible Plan for you
            </h2>
            <p className="">Choice suitable plan for you.</p>
          </div>
        </div>
        <div className="flex justify-center text-center mb-6">
          <button className="px-3" onClick={() => setActiveTimeline("yearly")}>
            Annual Plan
          </button>
          <div className="inline-flex items-center mx-2">
            <div
              className={`relative w-9 h-4 rounded-full border ${
                activeTimeline !== "yearly" ? "bg-blue-600" : "bg-white"
              }`}
            >
              <div
                className={`absolute w-3 h-3 rounded-full top-[1px] cursor-default ${
                  activeTimeline !== "yearly"
                    ? "bg-white left-5"
                    : "bg-gray-400 left-0.5"
                }`}
              />
            </div>
          </div>
          <button className="px-3" onClick={() => setActiveTimeline("monthly")}>
            Month-to-Month
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
          {content}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
