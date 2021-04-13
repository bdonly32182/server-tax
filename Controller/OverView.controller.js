const db = require('../Models');
const Op = db.Sequelize.Op
const sequelize = db.sequelize
const {QueryTypes} = require('sequelize') 

exports.Statistic =( async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let distict_id =req.user.distict_id
        const landAllDistrict = await sequelize.query(`
        select count(*) as totalLandInDistrict from land where distict_id ="${distict_id}"
        `,{type:QueryTypes.SELECT});
        const LandHaveUseful = await sequelize.query(`
        select count( * )as totalLandHaveUseful from ( select count(L.code_land) as totalLandHaveUseful from land L right join usefulLand UL on L.code_land = UL.Land_id
        where distict_id ="${distict_id}"
        group by L.code_land) as LandHaveUseful
        `,{type:QueryTypes.SELECT});
      
        // const LandHaveUseful = await db.Land.findAll({where:{distict_id:distict_id},
        //     include:[db.UsefulLand],
        //     attributes:[[sequelize.fn('count',sequelize.col('UsefulLands.useful_id')),'amoutUseful']]
        // })

        const buildAllDistrict = await db.Building.findAll({where:{Build_in_district: distict_id},
            attributes:[[sequelize.fn('count',sequelize.col('Build_Id')),'totalBuilding']]
        })
     
        const RoomAllDistrict = await sequelize.query(`
        select count(R.id) as totalRoom from condo C left join room R on C.id = R.Condo_no
        where C.distict_id = "${distict_id}"
        `,{type:QueryTypes.SELECT})
        const Owners = await db.Tax_Group.findAll({where:{Tax_in_district:distict_id},
            attributes:[[sequelize.fn('count',sequelize.col('uid_tax')),'amountTax']]
        })

        const LiveType = await sequelize.query(`
        select count(LT.id)as totalLiveType from building B inner join  live_type LT on B.Build_Id = LT.Build_live_ID
        where B.Build_in_district = "${distict_id}"
        `,{type:QueryTypes.SELECT});

        const OtherType = await sequelize.query(`
        select count(OT.id)as totalLiveType from building B inner join  other_type OT on B.Build_Id = OT.Build_other_ID
        where B.Build_in_district = "${distict_id}"
        `,{type:QueryTypes.SELECT});

        const EmptyType = await sequelize.query(`
        select count(ET.id)as totalLiveType from building B inner join  empty_type ET on B.Build_Id = ET.Build_empty_ID
        where B.Build_in_district = "${distict_id}"
        `,{type:QueryTypes.SELECT});

        const FarmType = await sequelize.query(`
        select count(FT.id)as totalLiveType from building B inner join  farm_type FT on B.Build_Id = FT.Build_farm_ID
        where B.Build_in_district = "${distict_id}"
        `,{type:QueryTypes.SELECT});

        return res.status(200).send({
            landAllDistrict,
            LandHaveUseful,
            buildAllDistrict,
            RoomAllDistrict,
            Owners,
            OtherType,
            EmptyType,
            FarmType,
            LiveType
        })
    }
    return res.status(403).send();
})

exports.YearStatistic = (async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let year = req.query.year
        let distict_id =req.user.distict_id
        const Income = await sequelize.query(`
        select sum(totalPriceOfTax) as totalPriceOfTax,sum(PriceExceptEmergency) as PriceExceptEmergency,
        sum(totalBuilaAndLandYear) as totalBuilaAndLandYear , sum(BriefTotal) as BriefTotal,
        sum(PriceLiveUseful) as PriceLiveUseful, sum(PriceOtherUseful) as PriceOtherUseful, 
        sum(PriceFarmUseful) as PriceFarmUseful, sum(PriceEmptyUseful) as PriceEmptyUseful,
        sum(PriceEmptyRoom)as PriceEmptyRoom, sum(PriceLiveRoom)as PriceLiveRoom, sum(PriceOtherRoom) as PriceOtherRoom
        from cost_book 
        where districtNo = "${distict_id}" and Year ="${year}"
        group by Year
        `,{type:QueryTypes.SELECT});

        
        return res.status(200).send({
            Income
        })
    }
    return res.status(403).send()
})